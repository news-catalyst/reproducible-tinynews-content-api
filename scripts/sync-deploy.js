#! /usr/bin/env node

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

const { program } = require('commander');
program.version('0.0.1');

var fs = require('fs');
var async = require('async');
var path = require("path");

const chalk = require("chalk");
const boxen = require("boxen");

// handles uploading `.webiny` to state bucket
// thanks to https://stackoverflow.com/a/46213474
const uploadDir = function(s3Path, bucketName) {
  function walkSync(currentDirPath, callback) {
      fs.readdirSync(currentDirPath).forEach(function (name) {
          var filePath = path.join(currentDirPath, name);
          var stat = fs.statSync(filePath);
          if (stat.isFile()) {
              callback(filePath, stat);
          } else if (stat.isDirectory()) {
              walkSync(filePath, callback);
          }
      });
  }

  walkSync(s3Path, function(filePath, stat) {
    let bucketPath = filePath.substring(s3Path.length+1);
    let params = {Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath) };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
      }
    });
  });
};

program
 .command('setup <env>')
 .description('creates infrastructure s3 buckets, uploads webiny env and state files')
 .action((env) => {
    const greeting = chalk.white.bold("sync-deploy setting up for environment: " + env);

    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      backgroundColor: "#555555"
    };
    const msgBox = boxen( greeting, boxenOptions );
    
    console.log(msgBox);

    const envBucket = `tinynewsplatform-environment-bucket-${env}`;
    // Create the parameters for calling createBucket
    var envBucketParams = {
      Bucket : envBucket,
      ACL: 'private'
    };
    const stateBucket = `tinynewsplatform-state-bucket-${env}`;
    var stateBucketParams = {
      Bucket : stateBucket,
      ACL: 'private'
    };

    console.log(chalk.white.bold("creating bucket: " + envBucket));

    // call S3 to create the bucket
    s3.createBucket(envBucketParams, function(err, data) {
      if (err) {
        console.log(chalk.red.bold("Error", err));
      } else {
        console.log(chalk.green.bold("Success", data.Location));

        // block public access on the bucket
        var params = {
          Bucket: envBucket, /* required */
          PublicAccessBlockConfiguration: { /* required */
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true
          }
        };

        s3.putPublicAccessBlock(params, function(err, data) {
          if (err) console.log(chalk.red.bold(err, err.stack)); // an error occurred
          else     console.log(chalk.green.bold("Successfully put public access block on ", envBucket, data));
        });
      }
    });

    console.log(chalk.white.bold("creating bucket: " + stateBucket))
    s3.createBucket(stateBucketParams, function(err, data) {
      if (err) {
        console.log(chalk.red.bold("Error", err));
      } else {
        console.log(chalk.green.bold("Success", data.Location));

        // block public access on the bucket
        var params = {
          Bucket: stateBucket, /* required */
          PublicAccessBlockConfiguration: { /* required */
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true
          }
        };

        s3.putPublicAccessBlock(params, function(err, data) {
          if (err) console.log(chalk.red.bold(err, err.stack)); // an error occurred
          else     console.log(chalk.green.bold("Successfully put public access block on", stateBucket, data));           // successful response
        });

        uploadDir(".webiny", stateBucket);
      }
    });
 });


program
 .command('api <env>')
 .description('does the actual api deployment to <env>')
 .action((env) => {
    const greeting = chalk.white.bold("sync-deploy api for env: " + env);

    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      backgroundColor: "#555555"
    };
    const msgBox = boxen( greeting, boxenOptions );
    console.log(msgBox);

    const envBucket = `tinynewsplatform-environment-bucket-${env}`;
    // Create the parameters for calling createBucket
    var rootParams = {
      Bucket: envBucket,
      Key: 'root.env.json'
    };
    var apiParams = {
      Bucket: envBucket,
      Key: 'api.env.json'
    };
    s3.getObject(rootParams).promise().then((data) => {
      writeFile('./.env.json', data.Body)
      console.log('./.env.json file downloaded successfully')
    }).catch((err) => {
        throw err
    })

    s3.getObject(apiParams).promise().then((data) => {
      writeFile('api/.env.json', data.Body)
      console.log('api/.env.json file downloaded successfully')
    }).catch((err) => {
        throw err
    })

    const stateBucket = `tinynewsplatform-state-bucket-${env}`;
    var stateParams = {
      Bucket: stateBucket
    };

    s3.listObjects(stateParams, function(err, data){
      if (err) return console.log(err);
    
      async.eachSeries(data.Contents, function(fileObj, callback){
        var key = fileObj.Key;
        console.log('Downloading: ' + key);
    
        var fileParams = {
          Bucket: stateParams.Bucket,
          Key: key
        }
    
        s3.getObject(fileParams, function(err, fileContents){
          if (err) {
            callback(err);
          } else {
            // Read the file
            var localFilename = '.webiny/' + key;
            console.log(' - saving ' + localFilename);
            writeFile(localFilename, data.Body)
            console.log(' - done ' + localFilename);
            callback();
          }
        });

      }, function(err) {
        if (err) {
          console.log('Failed: ' + err);
        } else {
          console.log('Finished');
        }
      });
    });
 });

 program.parse(process.argv);

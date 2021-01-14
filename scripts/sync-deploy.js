#! /usr/bin/env node

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

const { program } = require('commander');
program.version('0.0.1');

const chalk = require("chalk");
const boxen = require("boxen");

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

        const fyi2 = chalk.white.bold("blocking public access for bucket: " + envBucket);
        console.log(fyi2);
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

 });

 program.parse(process.argv);
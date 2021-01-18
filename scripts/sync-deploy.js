#! /usr/bin/env node

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

const { program } = require('commander');
program.version('0.0.1');

var fs = require('fs');
var async = require('async');
var path = require("path");

// to run the `yarn webiny deploy` command
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const chalk = require("chalk");
const boxen = require("boxen");
const { exit } = require('process');

const localWebinyDir = ".webiny";

async function doesBucketExist(bucketName) {
  var flag = false;
  try {
    // console.log("data: ", data);
    flag = true;
    // console.log( `Bucket "${bucketName}" exists`);
  }
  catch (err) {
    if (err.statusCode >= 400 && err.statusCode < 500) {
      console.log(chalk.yellow.bold(`Bucket "${bucketName}" not found`));
    }
  }
  return flag;
}

async function uploadEnvFiles(envBucket, cb) {
  // upload env files
  let putRootParams = {Bucket: envBucket, Key: 'root.env.json', Body: fs.readFileSync('.env.json') };
  s3.putObject(putRootParams, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log('✔️ Successfully uploaded '+ putRootParams.Key +' to ' + envBucket);
    }
  });
  let putApiParams = {Bucket: envBucket, Key: 'api.env.json', Body: fs.readFileSync('api/.env.json') };
  s3.putObject(putApiParams, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      cb(null, "uploadEnvFiles: api.env.json");
      console.log('✔️ Successfully uploaded '+ putApiParams.Key +' to ' + envBucket);
    }
  });
}

// handles the yarn deploy
async function yarnWebiny(env, cb) {
  const cmd = 'yarn webiny deploy api --env=' + env;
  console.log(chalk.white.bold("Deploying webiny API with command: " + cmd));
  try {
    const { stdout, stderr } = await exec(cmd);
    console.log(chalk.white(stdout));
    console.log(chalk.red.bold(stderr));
  } catch(err) {
    console.log(chalk.red.bold(err))
  }
  cb(null, "yarn webiny deploy")
}

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
        console.log('✔️ Successfully uploaded '+ bucketPath +' to ' + bucketName);
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

    doesBucketExist(envBucket).then((data) => {
      if (data) {
        console.log(chalk.cyan.bold("✔ " + envBucket + " already exists."))
      } else {
        // call S3 to create the bucket
        s3.createBucket(envBucketParams, function(err, data) {
          console.log(chalk.white.bold("👷‍♀️ Creating bucket: " + envBucket))
          if (err) {
            if (err.statusCode == 409) {
              console.log(chalk.cyan.bold("🪞 Nothing to do here, the bucket already exists"))
            } else {
              console.log(chalk.red.bold("🤬 Error", err));
            }
          } else {
            console.log(chalk.green.bold("🪣 Successfully created the bucket."));

            // block public access on the bucket
            var pubAccessParams = {
              Bucket: envBucket, /* required */
              PublicAccessBlockConfiguration: { /* required */
                BlockPublicAcls: true,
                BlockPublicPolicy: true,
                IgnorePublicAcls: true,
                RestrictPublicBuckets: true
              }
            };

            s3.putPublicAccessBlock(pubAccessParams, function(err, data) {
              if (err) console.log(chalk.red.bold(err, err.stack)); // an error occurred
              else     console.log(chalk.green.bold("🕵️‍♀️ Successfully configured ", envBucket, " for private access only"));
            });

            uploadEnvFiles(envBucket, function(err, data) {
              if (err) console.log(chalk.red.bold(err, err.stack)); // an error occurred
              else     console.log(chalk.green.bold("🖼 Successfully uploaded environment files to s3 ", envBucket));

            });
          }
        });
      }

    }).catch((err) => {
      console.log("error: ", err);
      throw err
    })

    doesBucketExist(stateBucket).then((data) => {
      if (data) {
        console.log(chalk.cyan.bold("✔ " + stateBucket + " already exists."))
      } else {
        console.log(chalk.white.bold("👷‍♀️ Creating bucket: " + stateBucket))
        console.log(chalk.cyan.bold("✔ " + stateBucket + " already exists."))
        s3.createBucket(stateBucketParams, function(err, data) {
          if (err) {
            if (err.statusCode == 409) {
              console.log(chalk.cyan.bold("🪞 Nothing to do here, the bucket already exists"))
            } else {
              console.log(chalk.red.bold("🤬 Error", err));
            }
          } else {
            console.log(chalk.green.bold("🪣 Successfully created the bucket."));

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
              else     console.log(chalk.green.bold("🕵️‍♀️ Successfully configured ", stateBucket, " for private access only"));
            });

            fs.access(localWebinyDir, function(err) {
              if (err && err.code === 'ENOENT') {
                console.log(chalk.bold.red("Looks like you haven't deployed the API yet; skipping upload of .webiny state"));
              } else {
                uploadDir(".webiny", stateBucket);
              }
            });
          }
        });
      }
    }).catch((err) => {
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
      fs.writeFile('./.env.json', data.Body, function(err, result) {
        if(err) console.log(chalk.red.bold('🤬 error', err));
      });
      console.log(chalk.green.bold('✔️ Downloaded .env.json file from S3'));
    }).catch((err) => {
        throw err
    })

    s3.getObject(apiParams).promise().then((data) => {
      fs.writeFile('api/.env.json', data.Body, function(err, result) {
        if(err) console.log(chalk.red.bold('🤬 error', err));
      });
      console.log(chalk.green.bold('✔️ Downloaded api/.env.json file from S3'));
    }).catch((err) => {
        throw err
    })

    const stateBucket = `tinynewsplatform-state-bucket-${env}`;
    var stateParams = {
      Bucket: stateBucket
    };

    // recursive download thanks gto https://gist.github.com/matthewdfuller/abcc38d23e2c73b1ee94
    s3.listObjects(stateParams, function(err, data){
      if (err) return console.log(err);
    
      async.eachSeries(data.Contents, function(fileObj, callback){
        var key = fileObj.Key;
        console.log(chalk.green.bold('Syncing state down from s3 to .webiny: ' + key));
    
        var fileParams = {
          Bucket: stateParams.Bucket,
          Key: key
        }

        s3.getObject(fileParams).promise().then((data) => {
          // Read the file
          var localFilename = path.join('.webiny', key);
          var localPath = path.dirname(localFilename);
          fs.access(localFilename, fs.constants.F_OK, (err) => {
            if (err) {
              fs.mkdir(localPath, { recursive: true }, (dirErr) => {
                if (dirErr) console.log(chalk.red("error making local dir " + localPath + ": " + err));
                fs.writeFile(localFilename, data.Body, function(err, result) {
                  if(err) console.log('🥴 error saving file: ', err);
                });
              });
            } else {
              fs.writeFile(localFilename, data.Body, function(err, result) {
                if(err) console.log('🥴 error saving file: ', err);
              });
            }
          });

          callback();
        }).catch((err) => {
            throw err
        })

      }, function(err) {
        if (err) {
          console.log('🤬 Error listing files in state bucket: ' + err);
        } else {
          console.log(chalk.cyan.bold("✔️ Env and state files synced! Running API deploy for " + env + " now..."));

          async.series([
            function(callback) {
              yarnWebiny(env, callback)
            },
            function(callback) {
              uploadEnvFiles(envBucket, callback);
            },
            function(callback) {
              uploadDir(".webiny", stateBucket, callback);
            }
          ], function(err, results) {
            if (err) {
              console.log(chalk.red.bold(err));
            } else {
              console.log(chalk.green.bold("Deploy and data sync finished!"));
            }
          });
        }
      });
    });
 });

 program.parse(process.argv);

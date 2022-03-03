var AWS = require('aws-sdk');
var lambda = new AWS.Lambda();

var params = {}; // define your parameters

lambda.createFunction(params, function(err, data) {
    if (err && err.code === 'InvalidParameterValueException') {

        // try again after a few seconds
        setTimeout(function(){
            lambda.createFunction(params, callback);
        }, 10000);
    } else {
        callback(err, data);
    }
});

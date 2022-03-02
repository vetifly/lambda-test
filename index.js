const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });
exports.handler = async function (event) {
  try {
    let eventbody=JSON.parse(event.body)
  console.log('EVENT: ', eventbody)
  const params = {
    Destination: {
      ToAddresses: [eventbody.senderEmail],
    },
    Message: {
      Body: {
        Text: { 
            Data: eventbody.message 
        },
      },
      Subject: { Data: `Message from AWS Lambda` },
    },
    Source: "sandeshverma05@gmail.com",
  };

  let rs=await ses.sendEmail(params).promise()
  let CORS_HEADERS= {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-': '',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': '*',
        'node-cache': 'Missed node-cache',
        'crossDomain': true
  }
  
  return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(rs,
            null,
            2
        )
    };
    
  }
  catch (err){
    console.log("here is error",err)
  }
};
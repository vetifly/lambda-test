// AWS Lambda Function
const fs = require('fs');
const fsPromises = require('fs').promises;
const ejs = require('ejs');
const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });

exports.handler = async function (event) {
  console.log('EVENT: ', event);

  const { siteVistorEmail, siteVisitorName, siteVisitorMessage, domainURL, phone } = event['queryStringParameters'];

  const domainEmailContacts = JSON.parse(fs.readFileSync('domainEmailContact.json', 'utf8'));
  const domainEmailContact = domainEmailContacts[`${domainURL}`];
  // Return if domain contact emails doesn't exists OR It is a spam message
  if (domainEmailContact == undefined || event['queryStringParameters'].hasOwnProperty('hashData')) return;
  const { senderEmail, recepientEmail } = domainEmailContact;

  const templatePath = `${__dirname}/contactSupportHTML.ejs`;
  const data = await fsPromises.readFile(templatePath, 'utf8');
  const emailBody = ejs.render(data, {
      name: siteVisitorName,
      email: siteVistorEmail,
      phone: phone,
      message: siteVisitorMessage,
  });
  // SES Email Object
  const params = {
    Destination: {
      ToAddresses: ["h.ali@vetifly.com"],
    },
    Message: {
      Body: {
        Html: { 
            Data: emailBody
        },
      },
      Subject: { Data: `New contact us request received!` },
    },
    Source: "r.kumar@vetifly.com",
  };
  console.log('hello world');
  // return {foo: params}
  return ses.sendEmail(params).promise();
};

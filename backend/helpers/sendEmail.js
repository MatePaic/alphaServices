const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const sendEmail = (email, options) => {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mg = mailgun.client({ username: 'api', key: apiKey });

    const data = {
        from: `test@${domain}`,
        to: email,
        ...options
    };
    mg.messages.create(domain, data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

module.exports = sendEmail;
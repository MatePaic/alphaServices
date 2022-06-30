const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const sendEmail = require('../helpers/sendEmail');
const crypto = require('crypto');
const path = require('path');
const fs = require("fs");
const ejs = require('ejs');

exports.getUsers = async (req, res) => {
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.send(userList);
}

exports.getUser = async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' });
    } 
    res.status(200).send(user);
}

exports.createUser = async (req, res) => {
    const user = new User({
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send('the user cannot be created');
    }
}

exports.userLogin = async (req, res) => {
    let fetchedUser;
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.SECRET;
    if(!user) {
        return res.status(400).send('The user not found');
    }
    fetchedUser = user;
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                email: fetchedUser.email,
                userId: fetchedUser.id
            },
            secret,
            {expiresIn : '1d'}
        )
        res.status(200).send({ token: token });
    } else {
        res.status(400).send('password is wrong!');
    }  
}


// tutroial for reseting password: https://medium.com/geekculture/forgot-password-in-signup-application-with-nodejs-and-mongodb-part-4-51378dddd716
exports.sendEmailForResetPassword = async (req, res) => {
    const user = await User.findOne({ email: { $eq: req.body.email } });
    if (!user) {
        return res.status(400).send('the user with requested email cannot be found!');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    const updatedUser = await User.findByIdAndUpdate(user.id, { resetPasswordToken, resetPasswordExpire }, { new: true });  
    if (!updatedUser) {
        return res.status(400).send('There was an issue sending an email to the user!');
    }
    
    const templateFilepath = path.join(__dirname, '..', 'templates', 'reset-password-email.ejs');
    const ejsString = fs.readFileSync(templateFilepath, 'utf8');
    const template = ejs.compile(ejsString);

    const subject = 'Reset Password Link';
    const email = user.email;
    const url = process.env.CLIENT_URL;
    const emailTemplateData = { email, url: `${url}/reset-password-enter-passwords?token=${resetPasswordToken}` };
    const html = template(emailTemplateData);
    sendEmail(email, {subject, html});

    res.send({success: true});
}

exports.setPasswordForResetPassword = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: { $eq: req.body.token },
        resetPasswordExpire: {
            $gt: Date.now()
        }
    });
    if (!user) {
        return res.status(400).send('The user with requested token cannot be found or the link has expired! Please try the process again.');
    }

    const updatedUser = await User.findByIdAndUpdate(
        user.id, {
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            resetPasswordToken: null,
            resetPasswordExpire: null
        }, { new: true }
    );
    if (!updatedUser) {
        return res.status(400).send('The user could not be updated!');
    }

    res.send({success: true});
}

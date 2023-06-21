const { compareSync } = require('bcrypt');
const { create, getalluser, getuserbyemail, getusername, updatetoken, checkemail, updatestatus,updateadmin,getuserdetails,changepassword,updateprofile } = require('./user.service');
const { sign } = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const generateVerificationToken = () => {
    const tokenLength = 32;
    const buffer = crypto.randomBytes(tokenLength);
    return buffer.toString('hex');
};
//in helper validate the json
//purpose of controller is
//1.interact with client
//2.perform validation
//3.invoke service methods
//4.return resposne
module.exports = {
    updateadmin:(req,res)=>{
        const body = req.body;
        updateadmin(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    updateprofile:(req,res)=>{
        const body = req.body;
        const uid=req.userId;
        body.uid=uid;
        updateprofile(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    updatestatus: (req, res) => {
        const uid = req.params.uid;
        updatestatus(uid, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                });
        })
    },
    checkemail: (req, res) => {
        const token = req.params.token;
        checkemail(token, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                });
        })
    },
    createUser: (req, res) => {
        const body = req.body;
        console.log(body);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            const verificationToken = generateVerificationToken();
            console.log(verificationToken);
            updatetoken(verificationToken,results.insertId, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(
                        {
                            success: 0,
                            message: "Database connection error"
                        }
                    );
                }
            });
            let url;
            let variable;
            let sub;
            if (body.usertype == 'admin') {
                url = `http://localhost:3001/admininvite?token=${verificationToken}`
                sub = 'BookNPack Admin Invitation'
                variable = `<p>Dear ${body.fname},</p>
                <p>You are invited to join as an admin in BookNPack</p>
                <p><a href=${url}>Click this link</a></p>
                <p>Best regards,</p>
                <p>Your BookNPack Team</p>`
            } else if (body.usertype == 'user') {
                url = `http://localhost:3001/verify?token=${verificationToken}`
                console.log(url);
                variable = `<p>Dear ${body.fname},</p>
                <p>Thank you for signing up. Please click the link below to verify your email address:</p>
                <p><a href=${url}>Verify Email</a></p>
                <p>If you did not sign up for an account, you can safely ignore this email.</p>
                <p>Best regards,</p>
                <p>Your BacKNPack Team</p>`
            }
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAIL_PASS
                }
            });
            const mailOptions = {
                from: process.env.GMAIL,
                to: body.email,
                subject: sub,
                html: variable
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    //res.status(200).send('Email sent successfully');
                }
            });
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    getuserbyemail: (req, res) => {
        const body = req.body;
        getuserbyemail(body, (err, results) => {
            console.log(results);
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Internal server error"
                    }
                );
            } else if (!results) {
                return res.status(401).json(
                    {
                        success: 0,
                        message: "Invalid credentials"
                    }
                );
            }
            const result = compareSync(body.password, results.password);
            let response = {};
            if (result) {
                const accesstoken = sign({ uid: results.uid }, process.env.ACCESS_KEY, {
                    expiresIn: "30m"
                });
                const refreshtoken = sign({ uid: results.uid }, process.env.REFRESH_KEY, {
                    expiresIn: "1w"
                });


                res.cookie('accessToken', accesstoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == "dev" ? "auto" : true,
                    domain: process.env.BE_URL,
                    maxAge: 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
                });
                res.cookie('refreshToken', refreshtoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV == "dev" ? "auto" : true,
                    domain: process.env.BE_URL,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
                });
                if (results.usertype == "user") {

                    res.cookie('userLoggedIn', true, {
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        secure: process.env.NODE_ENV == "dev" ? "auto" : true,
                        domain: process.env.BE_URL,
                        sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
                    });
                } else {

                    res.cookie('adminLoggedIn', true, {
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        secure: process.env.NODE_ENV == "dev" ? "auto" : true,
                        domain: process.env.BE_URL,
                        sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
                    });
                }

                return res.send(
                    {
                        message: 'success'
                    }
                )
            } else {
                return res.status(400).json(
                    {
                        success: 0,
                        message: "Invalid email or password"
                    }
                );
            }
        });
    },
    logout: (req, res) => {
        console.log(req)
        console.log(res);
        res.cookie('accessToken', '', {
            maxAge: 0,
            secure: process.env.NODE_ENV == "dev" ? "auto" : true,
            domain: process.env.BE_URL,
            sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
        });
        res.cookie('refreshToken', '', {
            maxAge: 0,
            secure: process.env.NODE_ENV == "dev" ? "auto" : true,
            domain: process.env.BE_URL,
            sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
        });
        res.cookie('userLoggedIn', '', {
            maxAge: 0,
            secure: process.env.NODE_ENV == "dev" ? "auto" : true,
            domain: process.env.BE_URL,
            sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
        });
        res.cookie('adminLoggedIn', '', {
            maxAge: 0,
            secure: process.env.NODE_ENV == "dev" ? "auto" : true,
            domain: process.env.BE_URL,
            sameSite: process.env.NODE_ENV == "dev" ? 'lax' : 'none'
        });
        return res.status(200).json(
            {
                success: 1,
                message: "Logout Successfully"
            }
        );

    },
    getusername: (req, res) => {
        var uid = req.userId;
        getusername(uid, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    getuserdetails: (req, res) => {
        var uid = req.userId;
        getuserdetails(uid, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    changepassword:(req,res)=>{
        var uid = req.userId;
        var body=req.body;
        body.uid=uid;
        changepassword(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    }

}
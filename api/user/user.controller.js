const { compareSync } = require('bcrypt');
const { create, getalluser, getuserbyemail } = require('./user.service');
const { sign } = require('jsonwebtoken');
//in helper validate the json
//purpose of controller is
//1.interact with client
//2.perform validation
//3.invoke service methods
//4.return resposne
module.exports = {
    createUser: (req, res) => {
        const body = req.body;
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
                results.password = undefined;
                const accesstoken = sign({ uid: results.uid }, process.env.ACCESS_KEY, {
                    expiresIn: "3s"
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
            maxAge: 0
        });
        res.cookie('refreshToken', '', {
            maxAge: 0
        });
        res.cookie('userLoggedIn', '', {
            maxAge: 0
        });
        res.cookie('adminLoggedIn', '', {
            maxAge: 0
        });
        return res.status(200).json(
            {
                success: 1,
                message: "Logout Successfully"
            }
        );

    }

}
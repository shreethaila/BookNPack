const { verify, sign, decode } = require('jsonwebtoken');
const cookie = require('cookie');
module.exports = {
    checkToken: (req, res, next) => {
        if (!req.headers.cookie) {
            return res.status('401').json(
                {
                    message: "Session expired login again"
                }
            );
        }
        console.log(req.headers.cookie);
        let cookiestr = req.headers.cookie;
        const cookies = cookie.parse(cookiestr);
        let accesstoken = cookies.accessToken;
        if (!accesstoken) {
            return res.status('401').json(
                {
                    message: "Session expired login again"
                }
            );
        }
        console.log(accesstoken);
        verify(accesstoken, process.env.ACCESS_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.log("expired");
                    const refreshtoken = cookies.refreshToken;
                    if (!refreshtoken) {
                        return res.status('401').json(
                            {
                                message: "Session expired login again"
                            }
                        );
                    }
                    verify(refreshtoken, process.env.REFRESH_KEY, (err, decoded) => {
                        if (err) {
                            return res.status('401').json(
                                {
                                    message: "Session expired login again"
                                }
                            );
                        } else {

                            console.log(decoded);
                            const accesstoken = sign({ uid: decoded.uid }, process.env.ACCESS_KEY, {
                                expiresIn: "30s"
                            });

                            res.cookie('accessToken', accesstoken, {
                                httpOnly: true,
                                domain: process.env.HOST,
                                maxAge: 60 * 60 * 1000
                            });
                            
                            req.userId = decoded.uid;
                            next();
                        }
                    });
                }
                else {
                    res.status(403).json(
                        {
                            success: 0,
                            message: "Invalid Token"
                        }
                    )
                }
            } else {
                req.userId = decoded.uid;
                next();
            }
        });
    }
}
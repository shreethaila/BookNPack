const {verify,sign,decode}=require('jsonwebtoken');
const cookie = require('cookie');
module.exports={
    checkToken:(req,res,next)=>{
        if (!req.headers.cookie){
            return res.status('401').json(
                {
                    message: "Session expired login again"
                }
            );
        }
        console.log(req.headers.cookie);
        let cookiestr=req.headers.cookie;
        const cookies = cookie.parse(cookiestr);
        accesstoken=cookies.accessToken;
        if (!accessToken){
            return res.status('401').json(
                {
                    message: "Session expired login again"
                }
            );
        }
        console.log(accesstoken);
        verify(accesstoken,process.env.ACCESS_KEY,(err,decoded)=>{
            if (err){
                if (err.name==="TokenExpiredError"){
                    console.log("expired");
                    const refreshtoken=cookies.refreshToken;
                    if (!refreshtoken){
                        return res.status('401').json(
                            {
                                message: "Session expired login again"
                            }
                        );
                    }
                    const payload=verify(refreshtoken,process.env.REFRESH_KEY,(err,decoded)=>{
                        if (err){
                            return res.status('401').json(
                                {
                                    message: "Session expired login again"
                                }
                            );
                        }
                    });
                    console.log(payload);
                    if (!payload){
                        return res.status(401).json({
                            message:"unauthenticated"
                        })
                    }
    
                    const accesstoken=sign({uid:payload.uid},process.env.ACCESS_KEY,{
                        expiresIn:"30s"
                    });
    
                    res.cookie('accessToken',accesstoken,{
                        httpOnly:true,
                        maxAge: 60*60*1000
                    });
                    next();
                }else{
                    res.status(403).json(
                        {
                            success: 0,
                            message: "Invalid Token"
                        }
                    )
                }
            }else{
                next();
            }
        });
    //     if (token){
    //         token=token.slice(7);//to remove BEARER
    //         verify(token,process.env.ACCESS_KEY,(err,decoded)=>{
    //             if (err){
    //                 if (err.name==="TokenExpiredError"){
    //                     const d=decode(token,{complete:true});
    //                     payl=d.payload;
    //                     const newtoken=sign(payl,process.env.KEY,{expiresIn:"1h"});
    //                     res.json(
    //                         {
    //                             success: 0,
    //                             message: "Token expired",
    //                             newtoken: newtoken

    //                         }
    //                     )

    //                 }else{
    //                     res.status(403).json(
    //                         {
    //                             success: 0,
    //                             message: "Invalid Token"
    //                         }
    //                     )
    //                 }
    //             }else{
    //                 next();
    //             }
    //         })
    //     }else{
    //         res.status(401).json(
    //             {
    //                 success:0,
    //                 message:"Access denied: Unauthorized user"
    //             }
    //         );
    //     }
     }
}
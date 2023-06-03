const { compareSync } = require('bcrypt');
const {create,getalluser,getuserbyemail}=require('./user.service');
const {sign}=require('jsonwebtoken');
//in helper validate the json
//purpose of controller is
//1.interact with client
//2.perform validation
//3.invoke service methods
//4.return resposne
module.exports={
    createUser: (req,res)=>{
        const body=req.body;
        create(body,(err,results)=>{
            if (err){
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
                    success:1,
                    data:results
                }
            );
        });
    },
    getuserbyemail:(req,res)=>{
        const body=req.body;
        getuserbyemail(body,(err,results)=>{
            console.log(results);
            if (err){
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }else if (!results){
                return res.status(400).json(
                    {
                        success: 0,
                        message: "Invalid email or password"
                    }
                ); 
            }
            const result=compareSync(body.password,results.password);
            if (result){
                results.password=undefined;
                const accesstoken=sign({uid:results.uid},process.env.ACCESS_KEY,{
                    expiresIn:"3s"
                });
                const refreshtoken=sign({uid:results.uid},process.env.REFRESH_KEY,{
                    expiresIn:"1w"
                });
                res.cookie('accessToken',accesstoken,{
                    httpOnly:true,
                    maxAge: 60*60*1000
                });
                res.cookie('refreshToken',refreshtoken,{
                    httpOnly:true,
                    maxAge: 7*24*60*60*1000
                });
                return res.send(
                    {
                        message:'success'
                    }
                )
            }else{
                return res.status(400).json(
                    {
                        success: 0,
                        message: "Invalid email or password"
                    }
                ); 
            }
        });
    },
    logout:(req,res)=>{
        res.cookie('accessToken','',{
            maxAge: 0
        });
        res.cookie('refreshToken','',{
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
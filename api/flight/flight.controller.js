const {addflightsch,searchflight,removeflight,cancelsch}=require('./flight.service');
module.exports={
    addflightsch: (req,res)=>{
        const body=req.body;
        addflightsch(body,(err,results)=>{
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
    searchflight: (req,res)=>{
        let date=req.query.date;
        let time=req.query.time;
        searchflight(date,time,(err,results)=>{
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
    removeflight:(req,res)=>{
        const body=req.body;
        removeflight(body,(err,results)=>{
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
    cancelsch:(req,res)=>{
        const body=req.body;
        cancelsch(body,(err,results)=>{
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
    }

}
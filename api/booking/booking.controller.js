const {bookticket,mybookings,getbookings}=require('./booking.service');
module.exports={
    bookticket: (req,res)=>{
        var uid=req.userId;
        const body=req.body;
        body.uid=uid;
        bookticket(body,(err,results)=>{
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
    mybookings: (req,res)=>{
        var uid=req.userId;
        mybookings(uid,(err,results)=>{
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
    getbookings: (req,res)=>{
        var fn=req.query.fn;
        var date=req.query.date;
        var time=req.query.time;
        getbookings(fn,date,time,(err,results)=>{
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
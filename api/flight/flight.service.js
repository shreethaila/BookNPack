const {addflight,addflightsch,searchflight,searchflightByDate,searchflightByDateTime,getflightByAirlineId_Number,cancelsch,removeflight}=require('./flight.dao');

//used to perform business logic
module.exports={
    addflightsch: (data,callback)=>{
        getflightByAirlineId_Number(data.aid,data.flightnumber,(err,results)=>{
            if (err){
                callback(err,results);
            }else{
                console.log(results);
                if (results.length===0){
                    addflight(data,(err,results)=>{
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            console.log(results);
                            addflightsch(results.insertId,data,callback);
                        }
                    });
                }else{
                    addflightsch(results[0].fid,data,callback);
                }
            }
        });
    },
    searchflight :(date,time,callback)=>{
        if (date==null && time==null){
            searchflight(callback);
        }else if (time==null){
            searchflightByDate(date,callback);
        }else{
            searchflightByDateTime(date,time,callback);
        }
    },
    removeflight:(data,callback)=>{
        removeflight(data,callback);
    },
    cancelsch:(data,callback)=>{
        cancelsch(data,callback);
    }
};
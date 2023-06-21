const {bookticket,occupiedseats,mybookings,getallbookings,getbookingByFlightNumber,getbookingByFlightNumberAndDate,getbookingsByFlightNumberDateTime,cancelbooking,getpassengers,getbookingcountbyschid,getbookingcountbyfid,getseatno}=require('./booking.dao');
module.exports={
    getbookingcountbyschid:(schid,callback)=>{
        getbookingcountbyschid(schid,callback);
    },
    getbookingcountbyfid:(fid,callback)=>{
        getbookingcountbyfid(fid,callback);
    },
    getpassengers:(bid,callback)=>{
        getpassengers(bid,callback);
    },
    bookticket:(data,callback)=>{
        occupiedseats(data,(err,results)=>{
            if (err){
                return callback(err);
            }
            console.log(results);
            var occup_seats=results[0].occ_seats
            if (60-occup_seats-data.booked_seats>0){
                bookticket(data,callback);
            }else{
                return callback(null,
                    {
                        message: data.booked_seats+" seats not available"
                    }
                );
            }
        });
    },
    occupiedseats:(data,callback)=>{
        occupiedseats(data,callback)
    },
    getseatno:(data,callback)=>{
        getseatno(data,callback)
    },
    mybookings:(uid,callback)=>{
        mybookings(uid,callback);
    },
    getbookings:(fn,date,time,callback)=>{
        if (fn==null && date==null && time==null){
            console.log("1");
            getallbookings(callback);
        }else if (date=="null" && time==null){
            console.log("2");
            getbookingByFlightNumber(fn,callback);
        }else if (time==null){
            console.log("3");
            getbookingByFlightNumberAndDate(fn,date,callback);
        }else{
            console.log("4");
            getbookingsByFlightNumberDateTime(fn,date,time,callback);
        }
    },
    cancelbooking:(bid,callback)=>{
        cancelbooking(bid,callback);
    }
}

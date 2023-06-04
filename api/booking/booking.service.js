const {bookticket,occupiedseats,mybookings,getallbookings,getbookingByFlightNumber,getbookingByFlightNumberAndDate,getbookingsByFlightNumberDateTime}=require('./booking.dao');
module.exports={
    bookticket:(data,callback)=>{
        occupiedseats(data,(err,results)=>{
            if (err){
                return callback(err);
            }
            console.log(results[0].occ_seats);
            var occup_seats=results[0].occ_seats
            if (60-occup_seats-data.booked_seats>0){
                //calculate fare
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
    mybookings:(uid,callback)=>{
        mybookings(uid,callback);
    },
    getbookings:(fn,date,time,callback)=>{
        if (fn==null && date==null && time==null){
            getallbookings(callback);
        }else if (date==null && time==null){
            getbookingByFlightNumber(fn,callback);
        }else if (time==null){
            getbookingByFlightNumberAndDate(fn,date,callback);
        }else{
            getbookingsByFlightNumberDateTime(fn,date,time,callback);
        }
    }
}

const pool=require('../../config/database');
module.exports={
    bookticket:(data,callback)=>{
        pool.query(
            'insert into booking (schid,uid,booked_seats,totalamt,dateofbooking,status) values (?,?,?,?,?,?)',
            [
                data.schid,
                data.uid,
                data.booked_seats,
                data.totalamt,
                new Date(),
                'active'
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    occupiedseats:(data,callback)=>{
        pool.query(
            'select sum(booked_seats) as occ_seats from booking where schid=?',
            [
                data.schid
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    mybookings:(uid,callback)=>{
        pool.query(
            'select * from booking where uid=? order by dateofbooking desc',
            [
                uid
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    getallbookings:(callback)=>{
        pool.query(
            'select * from booking dateofbooking desc',
            [
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    getbookingByFlightNumber:(fn,callback)=>{
        pool.query(
            'select from flight join travelschedule on flight.fid=travelschedule.fid as join booking on travelschedule.schid=booking.schid where flightnumber=? order by dateofbooking desc',
            [
                fn
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    getbookingByFlightNumberAndDate:(fn,date,callback)=>{
        pool.query(
            'select from flight join travelschedule on flight.fid=travelschedule.fid as join booking on travelschedule.schid=booking.schid where flightnumber=? and  schdate=? order by dateofbooking desc',
            [
                fn,
                date
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    getbookingsByFlightNumberDateTime:(fn,date,time,callback)=>{
        pool.query(
            'select from flight join travelschedule on flight.fid=travelschedule.fid as join booking on travelschedule.schid=booking.schid where flightnumber=? and  schdate=? and est_arrival_time=? order by dateofbooking desc',
            [
                fn,
                date,
                time
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    }


}
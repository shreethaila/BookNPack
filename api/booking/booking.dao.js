const pool = require('../../config/database');
module.exports = {
    bookticket: (data, callback) => {
        let resultsarr=[];
        var bookid;
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
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                for (const p of data.passenger) {
                    console.log(p);
                    console.log(results.insertId);
                    bookid=results.insertId;
                    pool.query(
                        'insert into passenger (bid,name,age,gender,proof_type,proofid) values (?,?,?,?,?,?)',
                        [
                            results.insertId,
                            p.name,
                            p.age,
                            p.gender,
                            p.proof_type,
                            p.proof_id

                        ],
                        (error,results,fields)=>{
                            console.log(results);
                            if (error){
                                return callback(error);
                            }else{
                                resultsarr.push(results);
                            }
                        }
                    )

                }
                pool.query(
                    'select fname,email from user where uid=?',
                    [
                        data.uid
                    ],
                    (error,results,fields)=>{
                        console.log(results);
                        if (error){
                            return callback(error);
                        }else{
                            data.bid=bookid;
                            data.fname=results[0].fname;
                            data.email=results[0].email;
                            return callback(null,data);
                        }
                    }
                )
            }
        )

    },
    occupiedseats: (data, callback) => {
        pool.query(
            'select COALESCE(sum(booked_seats),0) as occ_seats from booking where schid=?',
            [
                data.schid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    mybookings: (uid, callback) => {
        pool.query(
            'select b.bid,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid where uid=? order by t.schdate asc',
            [
                uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                console.log("my booking")
                return callback(null, results);
            }
        )
    },
    getallbookings: (callback) => {
        pool.query(
            'select * from booking dateofbooking desc',
            [
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                console.log("get all booking")
                return callback(null, results);
            }
        )
    },
    getbookingByFlightNumber: (fn, callback) => {
        pool.query(
            'select u.email,b.bid,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid join user u on b.uid=u.uid where t.fid=? order by dateofbooking desc',
            [
                fn
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getbookingByFlightNumberAndDate: (fn, date, callback) => {
        pool.query(
            'select u.email,b.bid,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid join user u on b.uid=u.uid where t.fid=? and t.schdate=? order by dateofbooking desc',
            [
                fn,
                date
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getbookingsByFlightNumberDateTime: (fn, date, time, callback) => {
        pool.query(
            'select * from flight join travelschedule on flight.fid=travelschedule.fid as join booking on travelschedule.schid=booking.schid where flightnumber=? and  schdate=? and est_arrival_time=? order by dateofbooking asc',
            [
                fn,
                date,
                time
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    cancelbooking:(bid,callback)=>{
        pool.query(
            'update booking set status=\'cancelled\' where bid=?',
            [
                bid
            ],
            (error,results,fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    }


}
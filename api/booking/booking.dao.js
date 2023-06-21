const pool = require('../../config/database');
module.exports = {
    getpassengers:(bid,callback)=>{
        pool.query(
            'select * from passenger where bid=?',
            [
                bid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },

    bookticket: (data, callback) => {
        console.log(data);
        let resultsarr = [];
        var bookid;
        pool.query(
            'insert into booking (schid,uid,booked_seats,totalamt,dateofbooking,status,seattype) values (?,?,?,?,?,?,?)',
            [
                data.schid,
                data.uid,
                data.booked_seats,
                data.totalamount,
                new Date(),
                'active',
                data.seattype
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                for (const p of data.passenger) {
                    console.log(p);
                    console.log(results.insertId);
                    bookid = results.insertId;
                    pool.query(
                        'insert into passenger (bid,name,age,gender,proof_type,proofid,seatno) values (?,?,?,?,?,?,?)',
                        [
                            results.insertId,
                            p.name,
                            p.age,
                            p.gender,
                            p.proof_type,
                            p.proof_id,
                            p.seatno
                        ],
                        (error, results, fields) => {
                            console.log(results);
                            if (error) {
                                return callback(error);
                            } else {
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
                    (error, results, fields) => {
                        console.log(results);
                        if (error) {
                            return callback(error);
                        } else {
                            data.bid = bookid;
                            data.fname = results[0].fname;
                            data.email = results[0].email;
                            return callback(null, data);
                        }
                    }
                )
            }
        )

    },
    occupiedseats: (data, callback) => {
        pool.query(
            ' SELECT  COALESCE(SUM(b.booked_seats), 0) AS occ_seats,   t.focc,   t.bocc,   t.eocc FROM   (SELECT s.schid, f.focc, f.bocc, f.eocc    FROM flight f    JOIN travelschedule s ON f.fid = s.fid    WHERE s.schid = ?) AS t LEFT JOIN   booking b ON b.schid = t.schid AND b.seattype = ? and b.status=\'active\' GROUP BY   f.focc,   f.bocc,   f.eocc;',
            [
                data.schid,
                data.seattype
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getseatno: (data, callback) => {
        pool.query(
            'SELECT p.seatno FROM booking b JOIN passenger p ON b.bid = p.bid WHERE b.schid=? and b.seattype=? and b.status=\'active\';',
            [
                data.schid,
                data.seattype
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
            'select a.logo,b.bid,b.totalamt,b.seattype,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid where uid=? order by b.dateofbooking desc',
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
            'select a.logo,u.email,b.bid,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid join user u on b.uid=u.uid where t.fid=? order by dateofbooking desc',
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
            'select a.logo,u.email,b.bid,a.airlinename, f.flightnumber, t.source,t.destination, t.schdate,t.est_arrival_time,t.depature_time,b.booked_seats,b.totalamt,b.dateofbooking,b.status from booking b join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid join user u on b.uid=u.uid where t.fid=? and t.schdate=? order by dateofbooking desc',
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
    cancelbooking: (bid, callback) => {
        pool.query(
            'update booking set status=\'cancelled\' where bid=?',
            [
                bid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                pool.query(
                    'select a.logo,u.email,b.bid,a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,b.booked_seats,b.dateofbooking from airline a join flight f on a.aid=f.aid join travelschedule t on t.fid=f.fid join booking b on t.schid=b.schid join user u on u.uid=b.uid where b.bid=?',
                    [
                        bid
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results);
                    }
                )
            }
        )
    },
    getbookingcountbyschid: (schid,callback) => {
        pool.query(
            'select exists(select 1 from booking where schid=? and status=\'active\') as record_exists;',
            [
                schid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getbookingcountbyfid: (fid,callback) => {
        pool.query(
            'select exists(select 1 from flight f join travelschedule t on f.fid=t.fid right join booking b on b.schid=t.schid where f.fid=?) as record_exists;',
            [
                fid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },


}
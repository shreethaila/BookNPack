const pool = require('../../config/database');
const util = require('util');
const mysql = require('mysql2/promise');

const pool1 = mysql.createPool({
    port: process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.USER,
    password:process.env.PASS,
    database:process.env.DB,
    connectionLimit: 10
});
module.exports = {
    addflight: (data, callback) => {
        pool.query(
            'insert into flight (flightnumber,aid,focc,bocc,eocc) values (?,?,?,?,?);',
            [
                data.flightnumber,
                data.aid,
                data.focc,
                data.bocc,
                data.eocc
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    addflightsch: (data, callback) => {
        console.log(data)
        pool.query(
            'insert into travelschedule (fid,source,destination,schdate,est_arrival_time,depature_time,firstclass,businessclass,economyclass) values (?,?,?,?,?,?,?,?,?)',
            [
                data.fid,
                data.source,
                data.destination,
                data.schdate,
                data.est_arrival_time,
                data.depature_time,
                data.firstclass,
                data.businessclass,
                data.economyclass
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    searchflight: (currdate, callback) => {
        pool.query(
            'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.firstclass,t.economyclass,t.businessclass, t.schid, f.focc - COALESCE(SUM(CASE WHEN b.seattype = \'f\' THEN b.booked_seats ELSE 0 END), 0) AS frem,   f.bocc - COALESCE(SUM(CASE WHEN b.seattype = \'b\' THEN b.booked_seats ELSE 0 END), 0) AS brem, f.eocc-COALESCE(SUM(CASE WHEN b.seattype=\'e\' THEN b.booked_seats ELSE 0 END),0) as erem from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where schdate>=? and t.status=\'active\' group by t.schid, f.focc, f.bocc,f.eocc order by schdate asc;',
            [
                currdate
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    searchflightByDate: (date, callback) => {
        pool.query(
            'select * from travelschedule where schdate=?',
            [date],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    searchflightByDateTime: (date, time, callback) => {
        pool.query(
            'select * from travelschedule where schdate=? and est_arrival_time=?',
            [
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
    getflightByAirlineId_Number: (aid, flightnumber, callback) => {
        pool.query(
            'select * from flight where aid=? and flightnumber=?',
            [
                aid,
                flightnumber
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    removeflight: async (data, callback) => {
        let connection;
      
        try {
          connection = await pool1.getConnection();
          await connection.beginTransaction();
      
          await connection.query('UPDATE flight SET status=\'removed\' WHERE fid=?', [data.fid]);
      
          const [updateResults] = await connection.query('CALL updateAndGetRow(?)', [data.fid]);
          const rows = updateResults[0];
      
          if (rows.length === 0) {
            console.log("zero");
            await connection.commit();
            connection.release();
            return callback(null, []);
          }
      
          const resultsarr = [];
      
          for (const row of rows) {
            await connection.query('UPDATE booking SET status=\'cancelled\' WHERE schid=?', [row.schid]);
      
            const [emailResults] = await connection.query(
              'SELECT b.bid,u.email,a.airlinename,f.flightnumber,t.source,t.destination,b.booked_seats,t.schdate,b.dateofbooking FROM user u JOIN booking b ON u.uid=b.uid join travelschedule t on b.schid=t.schid join flight f on f.fid=t.fid join airline a on a.aid=f.aid WHERE b.schid=?',
              [row.schid]
            );
      
            resultsarr.push(emailResults);
          }
      
          await connection.commit();
          connection.release();
      
          console.log(resultsarr);
          return callback(null, resultsarr);
        } catch (error) {
          if (connection) {
            await connection.rollback();
            connection.release();
          }
          return callback(error);
        }
      
    // removeflight: async (data, callback) => {
    //     pool.query(
    //         'update flight set status=\'removed\' where fid=?',
    //         [
    //             data.fid
    //         ],
    //         (error, results, fields) => {
    //             console.log(error);
    //             if (error) {
    //                 return callback(error);
    //             }
    //             console.log("1");
    //             pool.query(
    //                 'call updateAndGetRow(?)',
    //                 [
    //                     data.fid
    //                 ],
    //                 (error, results, fields) => {
                        
    //                     if (error) {
    //                         return callback(error);
    //                     }else{
    //                         console.log("this re");
    //                         console.log(results);
    //                         if(results[0].length == 0) {
    //                             console.log("zero");
    //                             return callback(null,resultsarr);
    //                         }
    //                         let resultsarr=[]
    //                         results[0].forEach(row => {
    //                             pool.query('update booking set status=\'cancelled\' where schid=?', [row.schid], (error, results, fields) => {
    //                                 //console.log("inside loop");
    //                                 if (error) {
    //                                     return callback(error);
    //                                 }
    //                                 console.log("3");
    //                                 pool.query(
    //                                     'select email from user u join (select uid from booking where schid=?) ss on u.uid=ss.uid',
    //                                     [
    //                                         row.schid
                                            
    //                                     ],
    //                                     (error,results,fields)=>{
    //                                         if (error){
    //                                             return callback(error);
    //                                         }else{
    //                                             console.log("up")
    //                                             console.log(results);
    //                                             console.log("down");
    //                                             resultsarr.push(results);
    //                                         }
    //                                     }
    //                                 )
    //                             })
    //                             console.log("array")
    //                             console.log(resultsarr);
    //                             console.log("loop");
    //                         });
    //                         console.log("4");
                            
    //                         return callback(null,resultsarr);
    //                         // console.log("resultarr");
    //                         // console.log(resultsarr);
    //                         // console.log("fullarr");
    //                         // console.log(fullarr);
    //                         // fullarr.push(resultsarr);
    //                     }
    //                 }
    //             )
                
                
    //         }

    //     )
        
        

            // console.log("dao" + data.fid)
            // pool.getConnection((error, connection) => {
            //     if (error) {
            //         connection.release();
            //         return callback(error);
            //     }

            //     connection.beginTransaction((error) => {
            //     if (error) {
            //         connection.release();
            //         return callback(error);
            //     }

            //     connection.query('update flight set status=\'removed\' where fid=?', [data.fid], (error, result) => {
            //         if (error) {
            //             console.log("11errorrr")
            //             connection.rollback(() => {
            //                 connection.release();
            //                 return callback(error);
            //             });
            //         }

            //         console.log("call prod")
            //         connection.query('call updateAndGetRow(?)', [data.fid], (error, result) => {
            //         if (error) {
            //             console.log("errorrr")
            //             connection.rollback(() => {
            //                 connection.release();
            //                 return callback(error);
            //             });
            //         }else{
            //             result[0].forEach(row => {
            //                 console.log("booking")
            //                 connection.query('update booking set status=\'cancelled\' where schid=?', [row.schid], (error, result) => {
            //                     if (error) {
            //                         connection.rollback(() => {
            //                             connection.release();
            //                             return callback(error);
            //                         });
            //                     }
            //                     connection.commit((error) => {
            //                         if (error) {
            //                         connection.rollback(() => {
            //                             connection.release();
            //                             return callback(error);
            //                         });
            //                         }
            //                         connection.release();
            //                         return callback(null,result);

            //                     });
            //                 });
            //             });
            //         }

            //     });
            //     });
            //     });
            // });

        },
            cancelsch: (data, callback) => {
                pool.getConnection((error, connection) => {
                    if (error) {
                        connection.release();
                        return callback(error);
                    }

                    connection.beginTransaction((error) => {
                        if (error) {
                            connection.release();
                            return callback(error);
                        }

                        connection.query('update travelschedule set status=\'cancelled\' where schid=?', [data.schid], (error, result) => {
                            if (error) {
                                connection.rollback(() => {
                                    connection.release();
                                    return callback(error);
                                });
                            }

                            connection.query('update booking set status=\'cancelled\' where schid=?', [data.schid], (error, result) => {
                                if (error) {
                                    connection.rollback(() => {
                                        connection.release();
                                        return callback(error);
                                    });
                                }
                                connection.commit((error) => {
                                    if (error) {
                                        connection.rollback(() => {
                                            connection.release();
                                            return callback(error);
                                        });
                                    }
                                    connection.release();
                                    return callback(null, result);

                                });
                            });
                        });
                    });
                });
            },
            searchbyall: (date, source, destination, callback) => {
                pool.query(
                    'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.firstclass,t.economyclass,t.businessclass, t.schid,  t.schid, f.focc - COALESCE(SUM(CASE WHEN b.seattype = \'f\' THEN b.booked_seats ELSE 0 END), 0) AS frem,   f.bocc - COALESCE(SUM(CASE WHEN b.seattype = \'b\' THEN b.booked_seats ELSE 0 END), 0) AS brem, f.eocc-COALESCE(SUM(CASE WHEN b.seattype=\'e\' THEN b.booked_seats ELSE 0 END),0) as erem from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where lower(source)=? and lower(destination)=? and t.schdate=? and t.status=\'active\' group by t.schid;',
                    [source, destination,date],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        console.log(results);
                        return callback(null, results);
                    }
                )
            },
            getairline: (callback) => {
                pool.query(
                    'select * from airline',
                    [],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results);
                    }
                )
            },
            getflight: (aid, callback) => {
                pool.query(
                    'select * from flight where aid=?',
                    [
                        aid
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results);
                    }
                )
            },
            searchbyplaces:(source,destination,currdate,callback)=>{
                pool.query(
                    'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.firstclass,t.businessclass,t.economyclass, t.schid,  t.schid, f.focc - COALESCE(SUM(CASE WHEN b.seattype = \'f\' THEN b.booked_seats ELSE 0 END), 0) AS frem,   f.bocc - COALESCE(SUM(CASE WHEN b.seattype = \'b\' THEN b.booked_seats ELSE 0 END), 0) AS brem, f.eocc-COALESCE(SUM(CASE WHEN b.seattype=\'e\' THEN b.booked_seats ELSE 0 END),0) as erem from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where lower(source)=? and lower(destination)=? and  t.schdate>= ? and t.status=\'active\' group by t.schid order by t.schdate asc;',
                    [
                        source,
                        destination,
                        currdate
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
                        return callback(null, results);
                    }
                )
            },
            getfare:(schid,callback)=>{
                pool.query(
                    'select firstclass,economyclass,businessclass from travelschedule where schid=?',
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

            }
}
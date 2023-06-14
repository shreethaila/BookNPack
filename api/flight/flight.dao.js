const pool = require('../../config/database');
module.exports = {
    addflight: (data, callback) => {
        pool.query(
            'insert into flight (flightnumber,aid,capacity) values (?,?,?);',
            [
                data.flightnumber,
                data.aid,
                data.capacity
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
            'insert into travelschedule (fid,source,destination,schdate,est_arrival_time,depature_time,fare) values (?,?,?,?,?,?,?)',
            [
                data.fid,
                data.source,
                data.destination,
                data.schdate,
                data.est_arrival_time,
                data.depature_time,
                data.fare
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
            'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.fare, t.schid, f.capacity-COALESCE(sum(b.booked_seats),0) as aseats from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where schdate>=? and t.status=\'active\' group by t.schid order by schdate asc;',
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
    removeflight: (data, callback) => {
        let resultsarr=[];
        pool.query(
            'update flight set status=\'removed\' where fid=?',
            [
                data.fid
            ],
            (error, results, fields) => {
                console.log(error);
                if (error) {
                    return callback(error);
                }
                pool.query(
                    'call updateAndGetRow(?)',
                    [
                        data.fid
                    ],
                    (error, results, fields) => {
                        console.log(error);
                        console.log(results);
                        if (error) {
                            return callback(error);
                        }else{
                            console.log("hhhhhh");
                            if(results[0].length == 0) {
                                console.log("zero");
                                return callback(null,resultsarr);
                            }
                            results[0].forEach(row => {
                                pool.query('update booking set status=\'cancelled\' where schid=?', [row.schid], (error, results, fields) => {
                                    console.log("inside loop");
                                    if (error) {
                                        return callback(error);
                                    }
                                    resultsarr.push(results);
                                })
                            });
                            return callback(null,resultsarr);
                        }
                    }
                )
                
            }

        )
        
        

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
                    'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.fare, t.schid, f.capacity-COALESCE(sum(b.booked_seats),0) as aseats from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where lower(source)=? and lower(destination)=? and t.schdate=? and t.status=\'active\' group by t.schid;',
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
            searchbyplaces:(source,destination,callback)=>{
                pool.query(
                    'select a.airlinename,f.flightnumber,t.source,t.destination,t.schdate,t.est_arrival_time,t.depature_time,t.fare, t.schid, f.capacity-COALESCE(sum(b.booked_seats),0) as aseats from airline a join flight f on f.aid=a.aid join travelschedule t on t.fid=f.fid left join booking b on b.schid=t.schid where lower(source)=? and lower(destination)=? and t.status=\'active\' group by t.schid order by t.schdate asc;',
                    [
                        source,
                        destination

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
                    'select fare from travelschedule where schid=?',
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
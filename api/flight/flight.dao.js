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
    addflightsch: (fid, data, callback) => {
        console.log(data)
        pool.query(
            'insert into travelschedule (fid,source,destination,schdate,est_arrival_time,depature_time,fare) values (?,?,?,?,?,?,?)',
            [
                fid,
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
            'select * from travelschedule t join flight f on t.fid=f.fid join airline a on a.aid=f.aid where schdate>=? and t.status=\'active\'',
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
        await pool.query(
            'update flight set status=\'removed\' where fid=?',
            [
                data.fid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
            }
        )
        await pool.query(
            'call updateAndGetRow(?)',
            [
                data.fid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }else{
                    results[0].forEach(row => {
                        pool.query('update booking set status=\'cancelled\' where schid=?', [row.schid], (error, results, fields) => {
                            if (error) {
                                return callback(error);
                            }
                            return callback(null,result);
                        })
                    });
                }
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
                    'select * from travelschedule where schdate=? and lower(source)=? and lower(destination)=?',
                    [date, source, destination],
                    (error, results, fields) => {
                        if (error) {
                            return callback(error);
                        }
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
            }
}
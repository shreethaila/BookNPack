const pool=require('../../config/database');
module.exports={
    addflight:(data,callback)=>{
        pool.query(
            'insert into flight (flightnumber,aid) values (?,?);',
            [
                data.flightnumber,
                data.aid
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    addflightsch:(fid,data,callback)=>{
        pool.query(
            'insert into travelschedule (fid,source,destination,schdate,est_arrival_time,depature_time,fare) values (?,?,?,?,?,?,?)',
            [
                fid,
                data.source,
                data.destination,
                data.schdate,
                data.est_arrival_date,
                data.depature_time,
                data.fare
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    searchflight: (callback)=>{
        pool.query(
            'select * from travelschedule',
            [],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    searchflightByDate: (date,callback)=>{
        pool.query(
            'select * from travelschedule where schdate=?',
            [date],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    searchflightByDateTime: (date,time,callback)=>{
        pool.query(
            'select * from travelschedule where schdate=? and est_arrival_time=?',
            [
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
    },
    getflightByAirlineId_Number:(aid,flightnumber,callback)=>{
        pool.query(
            'select * from flight where aid=? and flightnumber=?',
            [
                aid,
                flightnumber
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    removeflight:(data,callback)=>{
        
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
        
            connection.query('update flight set status=\'removed\' where fid=?', [data.fid], (error, result) => {
                if (error) {
                    connection.rollback(() => {
                        connection.release();
                        return callback(error);
                    });
                }
        
                connection.query('call updateAndGetRow(?)', [data.fid], (error, result) => {
                if (error) {
                    connection.rollback(() => {
                        connection.release();
                        return callback(error);
                    });
                }else{
                    result[0].forEach(row => {
                        connection.query('update booking set status=\'cancelled\' where schid=?', [row.schid], (error, result) => {
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
                                return callback(null,result);
            
                            });
                        });
                    });
                }

            });
            });
            });
        });
  
    },
    cancelsch:(data,callback)=>{
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
                        return callback(null,result);
    
                    });
                });
            });
            });
        });
    }
}
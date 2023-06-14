const pool=require('../../config/database');
//db access such as queries
//mapping query results to domain objects
module.exports={
    createuser: (data,callback)=>{
        pool.query(
            'insert into user (fname,lname,authtype,password,phoneno,address,email,usertype,accstatus) values (?,?,?,?,?,?,?,?,?)',
            [
                data.fname,
                data.lname,
                'password',
                data.password,
                data.phoneno,
                data.address,
                data.email,
                'user',
                'active'

            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        );
    },
    getalluser: (callback)=>{
        pool.query(
            'select * from user',
            [],
            (error,results,fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results);
            }
        )
    },
    getuserbyemail: (data,callback)=>{
        pool.query(
            'select uid,email,password,usertype from user where email=?',
            [
                data.email
            ],
            (error, results, fields)=>{
                if (error){
                    return callback(error);
                }
                return callback(null,results[0]);
            }
        )
    }

};
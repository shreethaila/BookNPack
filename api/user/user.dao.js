const pool = require('../../config/database');
const { compareSync } = require('bcrypt');
//db access such as queries
//mapping query results to domain objects
module.exports = {
    updatestatus: (uid, callback) => {
        pool.query(
            'update user set token=\'\', accstatus=\'active\' where uid=?',
            [
                uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    createuser: (data, callback) => {
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
                data.usertype,
                'signedup'

            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    checkemail: (token, callback) => {
        pool.query(
            'select * from user where token=? and accstatus=\'signedup\'',
            [
                token
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    updateadmin: (data, callback) => {
        pool.query(
            'update user set token=?,fname=?,lname=?,password=?,address=?,phoneno=?,accstatus=\'active\' where uid=?',
            [   data.token,
                data.fname,
                data.lname,
                data.password,
                data.address,
                data.phoneno,
                data.uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    updatetoken: (token,uid, callback) => {
        pool.query(
            'update user set token=? where uid=?',
            [token,uid],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getalluser: (callback) => {
        pool.query(
            'select * from user',
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getuserbyemail: (data, callback) => {
        pool.query(
            'select uid,email,password,usertype from user where email=?',
            [
                data.email
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    getusername: (uid, callback) => {
        console.log(uid);
        pool.query(
            'select fname from user where uid=?',
            [
                uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getuserdetails:(uid,callback)=>{
        console.log(uid);
        pool.query(
            'select fname,lname,email,phoneno,address from user where uid=?',
            [
                uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    changepassword:(data,callback)=>{
        pool.query(
            'select * from user where uid=?',
            [
                data.uid
            ],
            (error,results,feilds)=>{
                console.log("fetch result");
                console.log(results);
                const result = compareSync(data.oldpassword, results[0].password);
                if (result){
                    pool.query(
                        'update user set password=? where uid=?',
                        [
                            data.password,
                            data.uid
                        ],
                        (error, results, fields) => {
                            if (error) {
                                return callback(error);
                            }
                            return callback(null, {'result':'password changed'});
                        }
                    )
                }else{
                    return callback(null,{'result':'invalid old password'});
                }
            }
        )
        
    },
    updateprofile:(data,callback)=>{
        pool.query(
            'update user set fname=?,lname=?,email=?,phoneno=?,address=? where uid=?',
            [
                data.fname,
                data.lname,
                data.email,
                data.phoneno,
                data.address,
                data.uid
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    }

};
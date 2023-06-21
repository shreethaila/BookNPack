const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { createuser, getalluser, getuserbyemail, getusername, updatetoken, checkemail, updatestatus, updateadmin,getuserdetails,changepassword,updateprofile } = require('./user.dao');
const { NULL } = require('mysql/lib/protocol/constants/types');
//used to perform business logic
module.exports = {
    updateadmin: (data, callback) => {
        if ('password' in data) {
            const salt = genSaltSync(10);
            data.password = hashSync(data.password, salt);
        }
        updateadmin(data, callback);
    },
    checkemail: (token, callback) => {
        checkemail(token, callback);
    },
    updatestatus: (uid, callback) => {
        updatestatus(uid, callback);
    },
    updateprofile: (body, callback) => {
        updateprofile(body, callback);
    },
    create: (data, callback) => {
        if ('password' in data) {
            const salt = genSaltSync(10);
            data.password = hashSync(data.password, salt);
        }
        console.log(data);
        createuser(data, callback);
    },
    getalluser: (callback) => {
        getalluser(callback);
    },
    getuserbyemail: (data, callback) => {
        getuserbyemail(data, callback);
    },
    getusername: (uid, callback) => {
        getusername(uid, callback);
    },
    updatetoken: (token,uid, callback) => {
        updatetoken(token,uid, callback);
    },
    getuserdetails: (uid, callback) => {
        getuserdetails(uid, callback);
    },
    changepassword: (data, callback) => {
        if ('password' in data) {
            const salt = genSaltSync(10);
            data.password = hashSync(data.password, salt);
        }
        
        console.log(data);
        changepassword(data, callback);
    }
};
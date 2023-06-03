const {genSaltSync,hashSync,compareSync}=require('bcrypt');
const {createuser,getalluser,getuserbyemail}=require('./user.dao');

//used to perform business logic
module.exports={
    create: (data,callback)=>{
        const salt=genSaltSync(10);
        data.password=hashSync(data.password,salt);
        createuser(data,callback);
    },
    getalluser:(callback)=>{
        getalluser(callback);
    },
    getuserbyemail: (data,callback)=>{
        getuserbyemail(data,callback);
    }
};
const {createPool}=require("mysql2")
const pool=createPool({
    port: process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.USER,
    password:process.env.PASS,
    database:process.env.DB,
    connectionLimit: 15
});

module.exports=pool;
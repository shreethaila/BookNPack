const { addflight, addflightsch, searchflight, searchflightByDate, searchflightByDateTime, getflightByAirlineId_Number, cancelsch, removeflight, searchbyall, getairline, getflight, searchbyplaces, getfare,getschbyids,getschbyall,getflightbyfid,updateflight,getschedule,updateschedule} = require('./flight.dao');

const moment = require('moment');


const addFlightSchForStAndEnDate = (data, callback) => {
    const results = [];
    const startDate = moment(JSON.stringify(data.stFormattedData));
    const endDate = moment(JSON.stringify(data.endFormattedDate));

    const currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate)) {
        data.schdate = currentDate.format('YYYY-MM-DD');
        addflightsch(data, (err, result) => {
            results.push(result);
        });
        currentDate.add(1, 'day');
    }
    callback(null, results);
}


//used to perform business logic
module.exports = {
    getflightbyfid:(fid,callback)=>{
        getflightbyfid(fid,callback);
    },
    getschedule:(schid,callback)=>{
        getschedule(schid,callback);
    },
    getflight: (data, callback) => {
        getflight(data, callback);
    },
    addflightsch: (data, callback) => {
        addFlightSchForStAndEnDate(data, callback);
        // getflightByAirlineId_Number(data.aid, data.flightnumber, (err, results) => {
        //     if (err) {
        //         callback(err, results);
        //     } else {
        //         console.log(results);
        //         if (results.length === 0) {
        //             addflight(data, (err, results) => {
        //                 if (err) {
        //                     console.log(err);
        //                     return;
        //                 } else {
        //                     console.log(results);

        //                     addFlightSchForStAndEnDate(results.insertId, data, callback);
        //                 }
        //             });
        //         } else {
        //             addFlightSchForStAndEnDate(results[0].fid, data, callback);
        //         }
        //     }
        // });
    },
    addflight: (data, callback) => {
        addflight(data, callback);
    },
    searchflight: (date, time, source, destination, callback) => {
        if (date == "null" && source != "null" && destination != "null") {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            const currdatestr = `${year}-${month}-${day}`;
            console.log(currdatestr);
            searchbyplaces(source, destination, currdatestr, callback);
        } else if (date != null && source != null && destination != null) {
            console.log("1");
            searchbyall(date, source, destination, callback);
        }
        else if (date == null && time == null && source == null && destination == null) {
            console.log("2");
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            const currdatestr = `${year}-${month}-${day}`;
            console.log(currdatestr);

            searchflight(currdatestr, callback);
        } else if (time == null) {
            console.log("3");
            searchflightByDate(date, callback);
        } else {
            console.log("4");
            searchflightByDateTime(date, time, callback);
        }
    },
    removeflight: (data, callback) => {
        console.log("service")
        removeflight(data, callback);
    },
    cancelsch: (data, callback) => {
        cancelsch(data, callback);
    },
    getairline: (callback) => {
        getairline(callback);
    },
    getfare: (schid, callback) => {
        getfare(schid, callback);
    },
    getsch: (aid, fid, date, callback) => {

        if (date == "null" || date==null) {
            console.log("2");
            getschbyids(aid,fid,callback);
        } else if (aid!=null && fid!=null && date!=null) {
            console.log("3");
            getschbyall(aid,fid,date,callback);
        } 
    },
    updateflight:(body,callback)=>{
        updateflight(body,callback);
    },
    updateschedule:(body,callback)=>{
        updateschedule(body,callback);
    }
};
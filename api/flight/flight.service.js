const { addflight, addflightsch, searchflight, searchflightByDate, searchflightByDateTime, getflightByAirlineId_Number, cancelsch, removeflight,searchbyall ,getairline,getflight} = require('./flight.dao');

const moment = require('moment');


const addFlightSchForStAndEnDate = async(id, data, callback) => {
    const startDate = moment(JSON.stringify(data.stFormattedData));
    const endDate = moment(JSON.stringify(data.endFormattedDate));
    
    const currentDate = moment(startDate);
    
    while (currentDate.isSameOrBefore(endDate)) {
      data.schdate = currentDate.format('YYYY-MM-DD');
      await addflightsch(id, data, callback);
      currentDate.add(1, 'day');
    }
}


//used to perform business logic
module.exports = {
    getflight:(data,callback)=>{
        getflight(data,callback);
    },
    addflightsch: (data, callback) => {
        getflightByAirlineId_Number(data.aid, data.flightnumber, (err, results) => {
            if (err) {
                callback(err, results);
            } else {
                console.log(results);
                if (results.length === 0) {
                    addflight(data, (err, results) => {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log(results);
                            
                            addFlightSchForStAndEnDate(results.insertId, data, callback);
                        }
                    });
                } else {
                    addFlightSchForStAndEnDate(results[0].fid, data, callback);
                }
            }
        });
    },
    addflight:(data,callback)=>{
        addflight(data,callback);
    },
    searchflight: (date, time,source,destination, callback) => {
        if (date!=null && source!=null && destination!=null){
            searchbyall(date,source,destination,callback);
        }
        else if (date == null && time == null && source==null && destination==null) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            const currdatestr = `${year}-${month}-${day}`;
            console.log(currdatestr);

            searchflight(currdatestr,callback);
        } else if (time == null) {
            searchflightByDate(date, callback);
        } else {
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
    getairline:(callback)=>{
        getairline(callback);
    }
};
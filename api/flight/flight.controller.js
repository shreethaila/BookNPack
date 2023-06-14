const { addflightsch, searchflight, removeflight, cancelsch, getairline, addflight, getflight ,getfare} = require('./flight.service');
const moment = require('moment');

module.exports = {
    addflightsch: (req, res) => {
        const body = req.body;
        const startDate = moment(JSON.stringify(body.stFormattedData));
        const endDate = moment(JSON.stringify(body.endFormattedDate));
        if (startDate.isAfter(endDate)) {
            return res.status(400).json(
                {
                    success: 0,
                    message: "Invalid date selection"
                }
            );
        }
        addflightsch(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: true,

                }
            );
        });
    },
    searchflight: (req, res) => {
        console.log(req.query);
        let source;
        let destination;
        let date;
        let time;
        if (Object.keys(req.query).length === 0) {
            
            console.log("empty");
           source = null;
            date = null;
            time = null;
            destination = null;
        } else {
            source = req.query.source.toLowerCase();
           destination = req.query.destination.toLowerCase();
            date = req.query.date;
            time = req.query.time;
        }

        searchflight(date, time, source, destination, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            for (let i = 0; i < results.length; i++) {
                const date = new Date(results[i].schdate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                results[i].schdate = `${year}-${month}-${day}`;

            }
            console.log(results);
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    removeflight: (req, res) => {
        const body = {
            fid: req.params.id
        };
        console.log(body)
        removeflight(body, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            console.log("here remove");
            return res.status(200).json(
                {
                    success: true
                }
            );
        });
        // return res.status(200).json(
        //     {
        //         success: true,
        //         body: body
        //     }
        // );
    },
    cancelsch: (req, res) => {
        const body = req.body;
        cancelsch(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    getairline: (req, res) => {
        getairline((err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    addflight: (req, res) => {
        const body = req.body;
        addflight(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    }, getflight: (req, res) => {
        const aid = req.query.aid;
        getflight(aid, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        })
    },
    getfare:(req,res)=>{
        const schid = req.query.schid;
        getfare(schid, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        })
    }

}
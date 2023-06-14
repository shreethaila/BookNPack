const { addflightsch, searchflight, removeflight, cancelsch, getairline, addflight, getflight } = require('./flight.service');
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
        let source = req.query.source.toLowerCase();
        let destination = req.query.destination.toLowerCase();
        let date = req.query.date;
        let time = req.query.time;
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
    }

}
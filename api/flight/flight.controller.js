const { addflightsch, searchflight, removeflight, cancelsch, getairline, addflight, getflight, getfare } = require('./flight.service');
const moment = require('moment');
const nodemailer = require('nodemailer');
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
        //console.log(body)
        removeflight(body, (err, results) => {
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
            console.log(results);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAIL_PASS
                }
            });
            for (let i = 0; i < results.length; i++) {
                for (let j=0;j<results[i].length;j++){
                    var htmlvar="<p>We regret to inform you that your ticket has been canceled.</p>"+
                    "<p><b>Ticket Details</b></p><br>"+
                    `<p><b>Ticket Id </b>${results[i][j].bid}<br>`+
                    `<b>Airline Name </b>${results[i][j].airlinename}<br>`+
                    `<b>Flight Number </b>${results[i][j].flightnumber}<br>`+
                    `<b>Source </b>${results[i][j].source}<br>`+
                    `<b>Destination </b>${results[i][j].destination}<br>`+
                    `<b>Date </b>${results[i][j].schdate}<br>`+
                    `<b>No of Seats </b>${results[i][j].booked_seats}<br>`+
                    `<b>Date of Booking </b>${results[i][j].dateofbooking}</p>`+"<p>Sorry for the inconvenience and your payment will be refunded in few business days</p>";
                    const mailOptions = {
                        from: process.env.GMAIL,
                        to: results[i][j].email,
                        subject: "BookNPack Ticket Cancellation",
                        html: htmlvar
                    };
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send('Error sending email');
                        } else {
                            console.log('Email sent: ' + info.response);
                            //res.status(200).send('Email sent successfully');
                        }
                    });
                }
            }
            return res.status(200).json(
                {
                    success: true
                }
            );
        });

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
    getfare: (req, res) => {
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
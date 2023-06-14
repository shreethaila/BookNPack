const { bookticket, mybookings, getbookings, occupiedseats } = require('./booking.service');
const nodemailer = require('nodemailer');
module.exports = {
    occupiedseats: (req, res) => {
        const schid = req.params.schid;
        const body = { "schid": schid };
        occupiedseats(body, (err, results) => {
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
    bookticket: (req, res) => {
        var uid = req.userId;
        const body = req.body;
        body.uid = uid;
        bookticket(body, (err, results) => {
            console.log(results[0].email);
            if (err) {

                console.log(err);
                return res.status(500).json(
                    {
                        success: 0,
                        message: "Database connection error"
                    }
                );
            }
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '2012075@nec.edu.in', 
                    pass: 'vinayaga12**' 
                }
            });
            const mailOptions = {
                from: '2012075@nec.edu.in',
                to: results[0].email,
                subject: "BookNPack Ticket Booking",
                text: "Ticket booked successfully"
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
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    mybookings: (req, res) => {
        var uid = req.userId;
        mybookings(uid, (err, results) => {
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
                const date1 = new Date(results[i].schdate);
                const date2 = new Date(results[i].dateofbooking);
                const year1 = date1.getFullYear();
                const month1 = String(date1.getMonth() + 1).padStart(2, '0');
                const day1 = String(date1.getDate()).padStart(2, '0');
                const year2 = date2.getFullYear();
                const month2 = String(date2.getMonth() + 1).padStart(2, '0');
                const day2 = String(date2.getDate()).padStart(2, '0');

                results[i].schdate = `${year1}-${month1}-${day1}`;
                results[i].dateofbooking = `${year2}-${month2}-${day2}`;

            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    },
    getbookings: (req, res) => {
        var fn = req.query.fn;
        var date = req.query.date;
        var time = req.query.time;
        getbookings(fn, date, time, (err, results) => {
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
                const date1 = new Date(results[i].schdate);
                const date2 = new Date(results[i].dateofbooking);
                const year1 = date1.getFullYear();
                const month1 = String(date1.getMonth() + 1).padStart(2, '0');
                const day1 = String(date1.getDate()).padStart(2, '0');
                const year2 = date2.getFullYear();
                const month2 = String(date2.getMonth() + 1).padStart(2, '0');
                const day2 = String(date2.getDate()).padStart(2, '0');

                results[i].schdate = `${year1}-${month1}-${day1}`;
                results[i].dateofbooking = `${year2}-${month2}-${day2}`;

            }
            return res.status(200).json(
                {
                    success: 1,
                    data: results
                }
            );
        });
    }
}
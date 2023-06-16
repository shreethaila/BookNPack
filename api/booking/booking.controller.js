const { bookticket, mybookings, getbookings, occupiedseats,cancelbooking } = require('./booking.service');
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
            let tableRows='';
            for (const p of results.passenger) {
                tableRows += `<tr>
                                <td>${p.name}</td>
                                <td>${p.age}</td>
                                <td>${p.gender}</td>
                              </tr>`;
              }
            console.log(results);
            let variable = `
            <html>
    <head>
      <style>
        table {
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
        }
      </style>
    </head>
    <body>
    <p>Dear ${results.fname},\n\nYour ${results.booked_seats} ticket(s) has been booked successfully.\n\n Your ticket id is ${results.bid}.\n\nThank you for choosing BookNPack.</p>`+
    `<table>
        <tr>
          <th>Passenger Name</th>
          <th>Age</th>
          <th>Gender</th>
        </tr>
        ${tableRows}
    
            </tr>
      </table>
    </body>
  </html>`
                console.log(results.email);
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
                        pass: GMAIL_PASS 
                    }
                });
                const mailOptions = {
                    from: '2012075@nec.edu.in',
                    to: results.email,
                    subject: "BookNPack Ticket Booking",
                    html: variable
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
    },
    cancelbooking:(req,res)=>{
        var bid=req.params.bid;
        cancelbooking(bid,(err,results)=>{
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
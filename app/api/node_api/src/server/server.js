const express = require('express')
const sendMail = require('../sendEmailNow.js')
let app = express()
const port = 3000;
let i = 0
app.get('/sendemail', (req, res) => {
    i++
    const header = req.query.header;
    sendMail(req.query.header,req.query.body,req.query.token)
    // Example response for testing purposes
    console.log(i)
    res.send("done");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
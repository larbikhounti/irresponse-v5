const request = require('request');

 function sendMail(header, body, token) {
    
    const url = `http://localhost:3000/sendemail?header=${header}&body=${body}&token=${token}`;

    request(url, function (error, response, responseBody) {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Response Status Code:', response.statusCode);
            console.log('Response Body:', responseBody);
        }
    });

 
    };


module.exports = { sendMail };

// Requires (imports)
const express = require('express');
const fs = require('fs');
const imageData = require('./imageData');
const colors = require('./colors.json');
// Define variables
const app = express();

// enable CORS on /list route only
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// app.use(express.json());
// Body

app.get('/route', (req, res) => {
    fs.readFile('imageData.json', (err, data) => {
        if (err) console.error('There was an error,', err);
        res.send(imageData);
    });
});

app.get('/getColors', (req, res) => {
    fs.readFile('colors.json', (err, data) => {
        if (err) console.error('There was an error,', err);
        res.send(colors);
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

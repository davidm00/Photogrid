// Requires (imports)
const express = require('express');
const fs = require('fs');
const imageData = require('./imageData');
const colors = require('./colors.json');
const getColors = require('get-image-colors');
const download = require('image-downloader');
// Define variables
const app = express();

// enable CORS on /list route only
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(404);
});

app.get('/:url', (req, res) => {
    let fname = "";
    const url = decodeURI(req.params.url);
    const options = {
        url: url,
        dest: 'C:\\Users\\Patrick Soga\\Documents\\git-repos\\Photogrid\\backend\\Photos'
    };
    download.image(options)
        .then(({ filename, image }) => {
            fname = filename;
            console.log('File saved to ', fname);
            getColors(fname, (err, colors) => {
               if (err) console.log(err);
               else {
                   let rgb = colors.map((color) => color.rgb());
                   res.send({
                       "primary": rgb[0],
                       "secondary": rgb[1],
                       "tertiary": rgb[2],
                       "url": options.url
                   });
               }
            });
        })
        .catch((err) => {
            console.log(err);
        });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
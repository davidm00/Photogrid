// Requires (imports)
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const imageData = require('./imageData');
const colors = require('./colors.json');
const getColors = require('get-image-colors');
const download = require('image-downloader');

const Parse = require('parse/node');
Parse.initialize("c8kdZYyeKc4yC7JRnHwxBkwXDk9z1x5qrfc9VbEW", "zJMdP79YZ0KTYE7QLvaAKIBTolzlDInJOg6hmpaR");
Parse.serverURL = 'https://parseapi.back4app.com/';

const User = Parse.Object.extend("User");
user = new User();
user.set("username", "testuser");
user.set("password", "abc123");
user.save()
    .then((user) => {
        let Grid = Parse.Object.extend("Grid");
        let grid = new Grid();
        grid.set("gridRowCount", 3);
        grid.set("gridColCount", 3);
        grid.set("Type", "byColor");
        grid.set("user", user);
        grid.save()
            .then((grid) => {
                console.log('New grid object created by user: ' + user.id);
                }, (error) => {
                    console.log('Grid failed; error code: ' + error.message);
                });
        console.log('New user object created with username: ' + user.getUsername());
        }, (error) => {
            console.log('User Failed; error code: ' + error.message);
        });

// Define variables
const app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// enable CORS on /list route only
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let photoIndex = 0;

app.use(express.json());
// Body


app.get('/authorize', (req, res) => {
    res.redirect(ig.get_authorization_url(redirectUri, { scope: ['public_content', 'likes']}) );
});

app.get('/handleAuth', (req, res) => {
    ig.authorize_user(req.query.code, redirectUri, (err, result) => {
        if (err) res.send( err );
        accessToken = result.access_token;
        res.redirect('/');
    });
});


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

// url route
app.post('/url', (req, res) => {
    let fname = "";
    
    const url = req.body.url;
    console.log(url);
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
                   var Photo = Parse.Object.extend("Photo");
                   var photo = new Photo();
                   photo.set("primaryColor",{"r": rgb[0][0], "g": rgb[0][1], "b": rgb[0][2]});
                   photo.set("secondaryColor", {"r": rgb[1][0], "g": rgb[1][1], "b": rgb[1][2]});
                   photo.set("tertiaryColor", {"r": rgb[2][0], "g": rgb[2][1], "b": rgb[2][2]});
                   photo.set("objectID", "Test");
                   photo.save()
                       .then((photo) => {
                           console.log('New photo object created with objectId: ' + photo.id);
                       }, (error) => {
                           console.log('Photo Failed; error code: ' + error.message);
                       });
                   var userQuery = new Parse.Query("User");
                   userQuery.equalTo("username", "testuser");
                   userQuery.find()
                       .then((result) => {
                           photo.set("user", result[0]);
                           photo.save();
                       }, (error) => {
                           console.log("Unable to save photo to user: " + error.message);
                       });
                   var gridQuery = new Parse.Query("Grid");
                   gridQuery.equalTo("Type", "byColor");
                   gridQuery.find()
                       .then((result) => {
                           photo.set("grid", result[0]);
                           photo.save();
                       }, (error) => {
                           console.log("Unable to save photo to grid: " + error.message);
                       });
                   photo.save()
                       .then((photo) => {
                           console.log('New photo object created with objectId: ' + photo.id);
                       }, (error) => {
                           console.log('Photo Failed; error: ' + error.message);
                       });
                   res.send({
                       "url": options.url,
                       "rgb": [
                           {"r": rgb[0][0], "g": rgb[0][1], "b": rgb[0][2]},
                           {"r": rgb[1][0], "g": rgb[1][1], "b": rgb[1][2]},
                           {"r": rgb[2][0], "g": rgb[2][1], "b": rgb[2][2]}
                       ]
                   });
               }
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// base64 route
app.post('/base64', (req, res) => {
    console.log(req);
    let base64 = req.body.b64;
    let base64Image = base64.split(';base64').pop();
     fs.writeFile(`C:\\Users\\Patrick Soga\\Documents\\git-repos\\Photogrid\\backend\\Photos\\image${photoIndex}.png`, base64Image, {encoding: 'base64'}, (err) => {
        console.log('Image created');
    });
        getColors(`C:\\Users\\Patrick Soga\\Documents\\git-repos\\Photogrid\\backend\\Photos\\image${photoIndex}.png`, (err, colors) => {
            if (err) console.log(err);
            else {
                let rgb = colors.map((color) => color.rgb());
                var Photo = Parse.Object.extend("Photo");
                var photo = new Photo();
                photo.set("primaryColor",{"r": rgb[0][0], "g": rgb[0][1], "b": rgb[0][2]});
                photo.set("secondaryColor", {"r": rgb[1][0], "g": rgb[1][1], "b": rgb[1][2]});
                photo.set("tertiaryColor", {"r": rgb[2][0], "g": rgb[2][1], "b": rgb[2][2]});
                var userQuery = new Parse.Query("User");
                userQuery.equalTo("username", "testuser");
                userQuery.find()
                    .then((result) => {
                        photo.set("user", result[0]);
                        photo.save();
                    }, (error) => {
                        console.log("Unable to save photo to user: " + error.message);
                });
                var gridQuery = new Parse.Query("Grid");
                gridQuery.equalTo("Type", "byColor");
                gridQuery.find()
                    .then((result) => {
                        photo.set("grid", result[0]);
                        photo.save();
                    }, (error) => {
                        console.log("Unable to save photo to grid: " + error.message);
                    });
                photo.save()
                    .then((photo) => {
                        console.log('New photo object created with objectId: ' + photo.id);
                    }, (error) => {
                        console.log('Photo Failed; error: ' + error.message);
                    });
                res.send({
                    "rgb": [
                        {"r": rgb[0][0], "g": rgb[0][1], "b": rgb[0][2]},
                        {"r": rgb[1][0], "g": rgb[1][1], "b": rgb[1][2]},
                        {"r": rgb[2][0], "g": rgb[2][1], "b": rgb[2][2]}
                    ]
                });
                photoIndex++;
            }
        });
    console.log("Done");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
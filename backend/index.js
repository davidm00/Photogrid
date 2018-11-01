// Requires (imports)
const express = require('express');
const fs = require('fs');
const imageData = require('./imageData');
// Define variables
const app = express();


// app.use(express.json());
// Body

app.get('/', (req, res) => {
    fs.readFile('imageData.json', (err, data) => {
       if (err) console.error('There was an error,', err);
       res.send(imageData.dog);
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
/*
app.get('/write', (req, res) => {

    fs.writeFile('message.json', data.message, (err) => {
        if (err) console.log(err);
        console.log("Written to file");
    });

   res.status(200).send("Message is written to message.txt");
});

app.get('/message', (req, res) => {
    fs.readFile('message.json', (err, data) => {
         if (err) console.error('There was an error', err);
         res.send(data.toString());
    });
});

app.put('/write/:string', (req, res) => {
    data.message = req.params.string;
    res.send("New text written");
});

app.delete('/message/delete', (req, res) => {
   fs.writeFile('message.txt', "", (err) => {
      if (err) console.log(err);
   });
   res.send("Text deleted");
});
*/


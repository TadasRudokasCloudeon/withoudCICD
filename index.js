const express = require('express');
const db = require("./K054_db_actions.js");

const app = express();
const port = process.env.PORT || 3000;


var houses, rooms, devices;

app.get('/', (req, res) => {
    res.json({K054:'Hello World'});
});
app.get('/getUser', (req, res) => {

    db.getUser("testuka@testukas.fun",(data) => {
        res.end(JSON.stringify(data));
    });

});
app.get('/getHouses', (req, res) => {

    db.getHouses("4",(data) => {
        houses = data;
        res.json(houses);
    });

});

app.get('/getRooms', (req, res) => {

    db.getRooms(houses,(data) => {
        rooms = data;
        res.json(rooms);
    });

});

app.get('/getDevices', (req, res) => {

    db.getDevices(rooms,(data) => {
        devices = data;
        res.json(devices);
    });

});

app.get('/test', (req, res) => {

    db.getAllDevicesFromHouse(1,(data) => {
        res.end(JSON.stringify(data));
    });
});

app.listen(port, () => console.log(`Power meter backend app listening on port: ${port}!`))
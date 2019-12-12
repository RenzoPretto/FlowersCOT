const express = require('express');
const bodyParser = require('body-parser');
const swig = require('swig');
const sqlite = require('sqlite3');
swig.setDefaults({cache: false});

const db = new sqlite.Database('./flowers2019.db', (err) => console.log("Error: ", err));

const app = express();

app.get('/flowers', (req, res, next) => {
    db.all('SELECT * FROM flowers', (err, results) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
});

app.get('/flowersOrdered', (req, res, next) => {
    const { name } = req.query;
    db.all(`SELECT * FROM flowers f, sightings s WHERE f.COMNAME = s.NAME AND s.NAME = "${name}" ORDER BY s.SIGHTED`, (err, results) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
});

app.get('/flowers/add', (req, res) => {
    const { genus, species, comname} = req.query;
    const INSERT_FLOWER = `INSERT INTO flowers (genus, species, comname) values ('${genus}', '${species}', '${comname}')`;
    db.all(INSERT_FLOWER, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send("Success");
        }
    })
})

app.get('/sightings/add', (req, res) => {
    const { name, person, location, sight} = req.query;
    const INSERT_SIGHTING = `INSERT INTO sightings (name, person, location, sighted) values ('${name}', '${person}', '${location}', '${sight}')`;
    db.all(INSERT_SIGHTING, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send("Success");
        }
    })
})

app.get('/flowers/update', (req, res) => {
    const { genus, species, comname} = req.query;
    console.log("Test: ", {genus} + {species} + {comname})
    const UPDATE_FLOWER = `UPDATE flowers SET (genus, species, comname) = ('${genus}', '${species}', '${comname}') WHERE comname = '${comname}'`
    db.all(UPDATE_FLOWER, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send("Success");
        }
    });
})

app.get('/users/add', (req, res) => {
    const { user, pass } = req.query;
    console.log(user + " " + pass);
    const INSERT_USER = `INSERT INTO users (user, pass) values ('${user}', '${pass}')`;
    db.all(INSERT_USER, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send("Success");
        }
    });
})

app.get('/users/check', (req, res) => {
    const { user, pass } = req.query;
    console.log(user + " " + pass)
    const CHECK_USER = `SELECT * FROM USERS u WHERE u.PASS = '${pass}' AND u.USER = '${user}'`
    db.all(CHECK_USER, (err, results) => {
        console.log(results)
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    })
})

const port = 2000;

app.listen(port, () => console.log(`listening on port ${port}`))
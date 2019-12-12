var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./flowers2019.db', (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("Connected");
});

db.serialize(() => {
    db.each(`SELECT *
                FROM FLOWERS`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row.COMNAME);
    });
});

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed');
});
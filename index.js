import sqlite3 from 'sqlite3'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const HTTP_Port = 4500;
app.listen(HTTP_Port, () => {
    console.log("Server is listening on port " + HTTP_Port);
})

process.on('SIGINT', () => {
    console.log("Do not shut down the app on user log-off");
});

const db = new sqlite3.Database('./blog_db.db', (err) => {
    if (err) {
        console.error("ERROR opening db: " + err.message);
    }
    else {
        console.log("Connected to database successfully");

        // Create Posts table
        db.run('CREATE TABLE IF NOT EXISTS Posts (\
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            msg NVARCHAR(2000) NOT NULL, \
            likes INTEGER, \
            responses INTEGER\
        )', (err) => {
            if (err) {
                console.error("ERROR creating Posts table: " + err.message);
            } else {
                console.log("Posts table created or already exists");
            }
        });

        // Create Responses table
        db.run('CREATE TABLE IF NOT EXISTS Responses (\
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            post_id INTEGER, \
            Response_msg NVARCHAR(2000) NOT NULL\
        )', (err) => {
            if (err) {
                console.error("ERROR creating Responses table: " + err.message);
            } else {
                console.log("Responses table created or already exists");
            }
        });
    }
})


app.get("/Posts/:id", (req, res, next) => {
    var params = [req.params.id]
    db.get("Select * From Posts where id = ?", params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});

app.get("/Posts", (req, res, next) => {

    db.all("Select * From Posts", (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(rows);
    });
});





app.get("/Responses/:id", (req, res, next) => {
    var params = [req.params.id]
    db.get("Select * From Posts where id = ?", params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});
app.get("/Posts/:Post_id", (req, res, next) => {
    var params = [req.params.id]
    db.get("Select * From Posts where Post_id = ?", params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});

app.delete("/Posts/:Post_id", (req, res, next) => {
    var params = [req.params.id]
    db.get("Delete From Posts where Post_id = ?", params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});
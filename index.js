import sqlite3 from 'sqlite3'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const HTTP_Port = 4500;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(HTTP_Port, () => {
        console.log("Server is listening on port " + HTTP_Port);
    });

    process.on('SIGINT', () => {
        console.log("Do not shut down the app on user log-off");
    });
}

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
                responses INTEGER, \
                title NVARCHAR(80), \
                created_at TEXT DEFAULT (datetime(\'now\')) \
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

        // Create Skills table
        db.run('CREATE TABLE IF NOT EXISTS Skills (\
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
            name NVARCHAR(100) NOT NULL, \
            description NVARCHAR(500) NOT NULL\
        )', (err) => {
            if (err) {
                console.error("ERROR creating Skills table: " + err.message);
            } else {
                console.log("Skills table created or already exists");

                // Insert default skills if table is empty
                db.get("SELECT COUNT(*) as count FROM Skills", (err, row) => {
                    if (err) {
                        console.error("ERROR checking Skills count: " + err.message);
                    } else if (row.count === 0) {
                        const skills = [
                            { name: 'Angular', description: '3 years experience professional setting' },
                            { name: 'TypeScript', description: '3 years experience professional setting' },
                            { name: 'JavaScript', description: '3 years experience personal projects' },
                            { name: 'HTML/CSS', description: '5 years experience professional setting + personal projects' },
                            { name: 'Node.js', description: '2 years experience personal projects' },
                            { name: 'Git', description: '7 years experience personal projects + professional setting' },
                            { name: 'Python', description: 'High-level programming language' },
                            { name: 'C#', description: '3 years professional experience + personal projects' },
                            { name: 'SQL', description: '5 years professional experience + personal projects' },
                            { name: 'AWS', description: '.5 year professional experience' },
                        ];

                        const stmt = db.prepare("INSERT INTO Skills (name, description) VALUES (?, ?)");
                        skills.forEach(skill => {
                            stmt.run(skill.name, skill.description);
                        });
                        stmt.finalize(() => {
                            console.log("Skills data inserted successfully");
                        });
                    }
                });
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

app.get("/Skills", (req, res, next) => {
    db.all("SELECT * FROM Skills", (err, rows) => {
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
    db.delete("Delete From Posts where Post_id = ?", params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});

// Export for Vercel
export default app;
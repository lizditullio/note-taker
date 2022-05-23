const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json())

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))

function readDatabase() {
   const data = fs.readFileSync('./db/db.json', 'utf-8')
    return JSON.parse(data);
}

function writeToDatabase(data) {
    const json = JSON.stringify(data)
    fs.writeFileSync('./db/db.json', json)
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'notes.html'));
  });

app.get('/api/notes', (req, res) => {
    const database = readDatabase();
    res.json(database)
});

app.post('/api/notes', (req, res) => {
    const database = readDatabase();

    let newNote =  {
        title: req.body.title,
        text: req.body.text,
        id: crypto.randomUUID().substring(1, 10),
      };
    console.log(newNote)
    database.push(newNote);

    writeToDatabase(database);

    res.json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const database = readDatabase()

    for (let i = 0; i < database.lenght; i++) {
        const note = database[i]

        if(note.title == req.params.title) {
            //note.complete = req.body.complete 
            writeToDatabase(database);
            res.status(204).end();
        }
    }
    res.status(404).end()
});

app.delete('/api/notes/:id', (req, res) => {
    const database = readDatabase();
    const newData = database.filter((note) => note.id != req.params.id)
    if (database.length == newData.length) {
        res.status(404).end()
        return;
    }
    writeToDatabase(newData)
    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
} )
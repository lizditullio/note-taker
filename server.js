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
    
   let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: crypto.randomUUID(),
    }

    database.push(newNote);

    writeToDatabase(database);

    res.json(newNote);
});

app.put('/api/notes:id', (req, res) => {
    const database = readDatabase()

    for (let i = 0; i < database.lenght; i++) {
        const note = database[i]

        if(note.id == req.params.id) {
            note.complete = req.body.complete 
            writeToDatabase(database);
            res.status(204);
        }
    }
    res.status(404).end()
})

app.delete('/api/notes:id', (req, res) => {
    const database = readDatabase();
    const newData = database.filter((lead) => lead.id != req.params.id);
    if(database.lenght == newData.length) {
        res.status(404).end;
    }
    writeToDatabase(newData);
    res.status(200).end
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
} )
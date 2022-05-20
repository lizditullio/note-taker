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
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/api/get-all', (req, res) => {
    const database = readDatabase();
    res.json(database)
});

app.post('/api/add-lead', (req, res) => {
    const newLead = {...req.body}
    newLead.id = crypto.randomUUID();

    const database = readDatabase();

    database.push(newLead);

    writeToDatabase(database);

    res.json(newLead);
});

app.put('/api/update-lead/:id', (req, res) => {
    const database = readDatabase()

    for (let i = 0; i < database.lenght; i++) {
        const lead = database[i]

        if(lead.id == req.params.id) {
            
        }
    }
})

app.delete('/api/delete-lead:id', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
} )
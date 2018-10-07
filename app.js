const express = require('express');
const app     = express();
const port    = 3000;

const elastics = require('elasticsearch');
const es = elastics.Client({
    host: 'localhost:9200'
});

let players   = [
    {
        id : 1,
        name : 'Juan'
    },
    {
        id : 2,
        name : 'Carolina'
    }
];

app.get('/', (req, res) => res.send('Hello Game Server!'));

app.get('/players', (req, res) => {
    res.json(players);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
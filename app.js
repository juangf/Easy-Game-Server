const express  = require('express');
const elastics = require('elasticsearch');
const app      = express();
const port     = 3000;

// Elastisearch client
const es = elastics.Client({
    host: 'localhost:9200'
});

app.get('/', (req, res) => {
    res.send('The Easy Game Server is running');
});

/**
 * Get a player
 */
app.get('/player/:playerId', (req, res) => {
    es.get({
        index: 'game',
        type: 'player',
        id: req.params.playerId
    })
    .then(function(response) {
        res.send(response._source);
    });
});

/**
 * Get all the registered players
 */
app.get('/players', (req, res) => {
    es.search({
        index: 'game'
    })
    .then(function(response) {
        res.send(response.hits.hits);
    });
});

app.listen(port, () => console.log(`Easy Game Server listening on port ${port}!`));
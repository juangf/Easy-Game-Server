const express  = require('express');
const elastics = require('elasticsearch');
const helmet   = require('helmet');
const token    = require('token');
const app      = express();
const port     = 3000;

// Elastisearch client
const es = elastics.Client({
    host: 'localhost:9200'
});

// Security http headers
app.use(helmet());

token.defaults.secret   = 'agoodsecret';
token.defaults.timeStep = 20;

app.use(function (req, res, next) {
    let token = req.headers['x-easy-server-token'];
    
    if (req.path !== '/register') {
        
    }

    next();
})

app.get('/', (req, res) => {
    res.json(req.headers);
});

/**
 * Register unique device/player
 */
app.post('/register', (req, res) => {
    if (!req.params.id) {
        res.status(400);
        res.send('None shall pass');
        return;
    }

    let ip       = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let newToken = token.generate(req.params.id + '|' + ip);

    res.json({
        token: token
    });
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
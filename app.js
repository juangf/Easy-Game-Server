const express    = require('express');
const elastics   = require('elasticsearch');
const helmet     = require('helmet');
const token      = require('token');
const HttpStatus = require('http-status-codes');
const bodyParser = require('body-parser');
const app        = express();
const port       = 3000;

// Elastisearch client
const es = elastics.Client({
    host: 'localhost:9200'
});

// Security http headers
app.use(helmet());

// Configure the token generator
token.defaults.secret   = 'agoodsecret';
token.defaults.timeStep = 60 * 60 * 24;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Check security
app.use(function (req, res, next) {
    let tokenValue = req.headers['x-easy-server-token'];
    let id         = req.headers['x-easy-server-id'];
    
    if (req.path !== '/register' && !token.verify(id, tokenValue)) {
        res
            .status(HttpStatus.UNAUTHORIZED)
            .json({
                error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
            });
        return;
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
    if (!req.body.id) {
        res
            .status(HttpStatus.BAD_REQUEST)
            .json({
                error: 'missing parameters'
            });
        return;
    }

    let ip       = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let newToken = token.generate(req.body.id);

    res.json({
        token: newToken
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
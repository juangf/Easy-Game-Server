const token      = require('token');
const HttpStatus = require('http-status-codes');

// Configure the token generator
token.defaults.secret   = 'agoodsecret';
token.defaults.timeStep = 60 * 60 * 24;

exports.authorize = (req, res, next) => {
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
};

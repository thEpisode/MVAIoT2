function Routes(dependencies) {

    /// Dependencies
    var _console;
    var _app;
    var _express;
    var _io;
    var _bodyParser;
    var _morgan;
    var _mongoose;
    var _jwt;
    var _checkInternet;
    var _database;
    var _cross;
    var _fileHandler;
    var _insights;

    var _apiRoutes;

    var constructor = function () {
        _app = dependencies.app;
        _express = dependencies.express;
        _bodyParser = dependencies.bodyParser;
        _database = dependencies.database;
        _console = dependencies.console;
        _apiRoutes = _express.Router();
        _cross = dependencies.cross;
        _jwt = dependencies.jwt;
        _fileHandler = dependencies.fileHandler;
        _insights = dependencies.insights;

        createAPI();

        _console.log('API routes module initialized', 'server-success');
    }

    var createAPI = function () {

        /// Insight api routes
        /// -------------------------
        //  (POST http://localhost:3000/api/Insight/Create)
        _apiRoutes.post('/Insight/Create', function (req, res) {
            _database.Insight().CreateInsight(req.body, function (result) {
                res.json({ success: true, message: 'CreateInsight', result: true });
            })
        });

        /// Middleware
        /// -------------------------
        //  To verify a token
        _apiRoutes.use(function (req, res, next) {
            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            // decode token
            if (token) {
                // verifies secret and checks exp
                _jwt.verify(token, _app.get('MVAIoT2SecretJWT'), function (err, decoded) {
                    if (err) {
                        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
                    }
                    else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        next();
                    }
                });

            }
            else {

                // if there is no token
                // return an error
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });

            }
        });

        /// Welcome
        /// -------------------------
        // route to show message (GET http://localhost:3000/api/Welcome)
        _apiRoutes.get('/Welcome', function (req, res) {
            res.json({ success: true, message: 'Welcome to the coolest API on earth!' });
        });

        
        // apply the routes to our application with the prefix /api
        _app.use('/api', _apiRoutes);
    }

    return {
        Initialize: constructor
    }
}

module.exports = Routes;
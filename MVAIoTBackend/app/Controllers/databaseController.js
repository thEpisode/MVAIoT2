function Database(dependencies) {

    /// Dependencies   
    var _mongoose;
    var _cross;

    /// Properties
    var _db;
    var _dbConnected;

    /// Entities
    var _Insight;

    var constructor = function (callback) {
        _mongoose = dependencies.mongoose;
        _cross = dependencies.cross;
        _console = dependencies.console;

        databaseConnect(function (result) {
            callback(result);
        });
    }

    var databaseConnect = function (callback) {
        _mongoose.Promise = global.Promise;
        _mongoose.connect(_cross.GetMongoConnectionString());
        _db = _mongoose.connection;

        databaseHandler(function (result) {
            _console.log('Database module initialized', 'server-success');
            callback(result);
        });
    }

    var databaseHandler = function (callback) {
        _db.on('error', function () {
            _dbConnected = false;
            callback(false);
        });

        _db.once('open', function () {
            _console.log('Database connected at ' + _cross.GetMongoConnectionString(), 'server-success');
            _dbConnected = true;

            entitiesControllers(function (result) {
                callback(result);
            });
        });
    }


    var entitiesControllers = function (callback) {
        _Insight = require('./insightController')(dependencies);
        _Insight.Initialize();

        callback(true);
    }

    var isConnected = function () {
        return _dbConnected;
    }

    var getInsightController = function () {
        return _Insight;
    }

    return {
        Initialize: constructor,
        IsConnected: isConnected,
        Insight: getInsightController,
    }
}

module.exports = Database;
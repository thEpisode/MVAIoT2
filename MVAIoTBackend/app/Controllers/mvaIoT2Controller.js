function MVAIoT2Server(dependencies) {

    var _app;

    // Modules
    var _cross;
    var _console;
    var _frontendController;
    var _routesController;
    var _socketController;
    var _databaseController;

    var constructor = function () {
        _app = dependencies.app;

        /// Own Console declaration
        _console = require('./consoleController')(dependencies);
        _console.Initialize();
        dependencies.console = _console;

        /// Cross declaration
        _cross = require('./crossController')({});
        dependencies.cross = _cross;
        _cross.SetMVAIoT2SecretJWT("MVAIoT2IsCool");
        _cross.SetMongoConnectionString("mongodb://mvadatabase:dxzTy1qNVQMx2HjTlem6IDNVpzC2J7tTuUxRYq4AdKt27RDlGYwx5uf7rO4Y5Ri40syI3xAOWwdPGuBc7D7U8w==@mvadatabase.documents.azure.com:10250/?ssl=true");

        /// Setting up secret for JWT
        _app.set('MVAIoT2SecretJWT', _cross.GetMVAIoT2SecretJWT());

        /// Socket declaration
        _socketController = require('./socketController')(dependencies);
        dependencies.socket = _socketController;

        /// Database declaration
        _databaseController = require('./databaseController')(dependencies);
        dependencies.database = _databaseController;

        _databaseController.Initialize(function (result) {
            if (result == true) {

                /// Frontend declaration
                _frontendController = require('./frontendController')(dependencies);


                /// Routes declaration
                _routesController = require('./routesController')(dependencies);


                initializeControllers();

                _console.log('Server initialized', 'server-success');
            }
        });
    }

    var initializeControllers = function () {
        _routesController.Initialize();
        _frontendController.Initialize();
        _socketController.Initialize();

        _console.log('Modules initialized', 'server-success');
    }

    return {
        Initialize: constructor
    }
}

module.exports = MVAIoT2Server;
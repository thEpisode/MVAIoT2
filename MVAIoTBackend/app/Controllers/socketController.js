function Socket(dependencies) {

    /// Dependencies
    var _console;
    var _io;
    var _database;
    var _fileHandler;
    var _cross;
    var _uuid;

    var constructor = function () {
        _io = dependencies.io;
        _database = dependencies.database;
        _console = dependencies.console;
        _cross = dependencies.cross;
        _uuid = dependencies.uuid;

        socketImplementation();
        _console.log('Socket module initialized', 'server-success');
    }


    var socketImplementation = function () {

        /// User Pool Namespace (UPN)
        ///
        /// All site Users will be connected in this pool and wait for any request
        _io.sockets.on('connection', function (socket) {
            _console.log('Client connected: ' + socket.id, 'socket-message');

            /// Emit a welcome message to new connection
            socket.emit('Welcome', { Message: 'Welcome to MVAIoT2', SocketId: socket.id });

            /// Catch when this connection is closed
            socket.on('disconnect', function () {
                _console.log('Client disconnected: ' + socket.id, 'socket-message');
            });

            socket.on('MVAIoT2.EVENT', function (data) {
                if (data.Command != undefined) {
                    // TODO
                    //adminPoolNamespace.emit('MVAIoT2.MVAIoT2.RAT', { Command: 'SubscribeSocketToApiKey#Request', Values: { SocketId: socket.id.split('#')[1], ApiKey: data.ApiKey } });
                }
            })

        });
    }

    return {
        Initialize: constructor
    }
}

module.exports = Socket;
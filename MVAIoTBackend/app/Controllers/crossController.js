function Cross(dependencies) {

    var _socket;
    var _mongoConnectionString;
    var _mvaIoT2SecretJWT;

    var getSocket = function () {
        return _socket;
    }

    var getMongoConnectionString = function () {
        return _mongoConnectionString;
    }

    var setMongoConnectionString = function (connectionString) {
        _mongoConnectionString = connectionString;
    }

    var setSocket = function (socket) {
        _socket = socket;
    }

    var getMVAIoT2SecretJWT = function () {
        return _mvaIoT2SecretJWT;
    }

    var setMVAIoT2SecretJWT = function (secret) {
        _mvaIoT2SecretJWT = secret;
    }

    /// Find an object dynamically by dot style
    /// E.g.
    /// var objExample = {employee: { firstname: "camilo", job:{name:"driver"}}}
    /// findObject(objExample, 'employee.job.name')
    var objectReferenceByDotStyle = function (obj, is, value) {
        if (typeof is == 'string')
            return index(obj, is.split('.'), value);
        else if (is.length == 1 && value !== undefined)
            return obj[is[0]] = value;
        else if (is.length == 0)
            return obj;
        else
            return index(obj[is[0]], is.slice(1), value);
    }

    /// Find an object into array by Id
    /// E.g.
    /// var objectResult = searchObjectByIdOnArray("someId", myArray)
    var searchObjectByIdOnArray = function (nameKey, _array) {
        for (var i = 0; i < _array.length; i++) {
            if (_array[i].Id === nameKey) {
                return _array[i];
            }
        }
        return null;
    }

    var normalizePort = function (val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    return {
        SetSocket: setSocket,
        GetSocket: getSocket,
        SetMongoConnectionString: setMongoConnectionString,
        GetMongoConnectionString: getMongoConnectionString,
        SetMVAIoT2SecretJWT: setMVAIoT2SecretJWT,
        GetMVAIoT2SecretJWT: getMVAIoT2SecretJWT,
        ObjectReferenceByDotStyle: objectReferenceByDotStyle,
        NormalizePort: normalizePort,
        SearchObjectByIdOnArray: searchObjectByIdOnArray
    }
}

module.exports = Cross;
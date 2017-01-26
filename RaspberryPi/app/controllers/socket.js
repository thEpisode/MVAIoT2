function initialize(io, ioClient, globals){
	var mvaiotbackend = null;
	var myMVAIoTBackendId = null;
    	
	if(globals.MVAIoTBackend != undefined && globals.MVAIoTBackend.length > 0)
		mvaiotbackend = ioClient.connect(globals.MVAIoTBackend);
		
	mvaiotbackend.on('connect', function(){
		console.log('Connected to MVAIoTBackend');
	});
	
	mvaiotbackend.on('disconnect', function(){
		console.log('MVAIoTBackend is offline');
	});
	
	mvaiotbackend.on('Welcome', function(data){
		myMVAIoTBackendId = data.SocketId;
	});
	
    
    mvaiotbackend.on('MVAIoTBackend.Message', function(data){
        mvaiotbackendMessageHub(data);
    })
	
	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});
				
		/* 
		================
		Local functions 
		*/
		
		/// Emit all cranes
		function sendHydraMessage(){			
			socket.emit('Clapp.Hydra.Message', {Command : 'HydraCommand', Values : 1});
		}
		
		/* 
		================
		Socket Intervals
		*/
		/// Emit every 5 seconds cranes
		setInterval(sendHydraMessage, 5000);
	
		/* 
		================
		Templates for Socket.io
		*/
		/// Template for socket event
		//socket.on('', function(data){
		//  io.sockets.emit('Name', data);
		// socket.emit('ID', {Command: 'CommandID', Values:[{ID: socket.id}]});
		//});
	
	});
		
	console.log('Socket.io initialized');
    
    function mvaiotbackendMessageHub(data){
        console.log('MVAIoTBackend catched: Clapp.MVAIoTBackend.Message');
        var values = data.Values;
        var command = data.Command;
        switch(command) {
            case "GiveYourHydraInformation":
                console.log(globals.HydraUUID);
                mvaiotbackend.emit('Clapp.Hydra.Information', {HydraSettings : globals.HydraSettings});
                break;
            case "GiveYourAllInformation":
                if(values.UUID == globals.HydraSettings.UUID){
                    mvaiotbackend.emit('Clapp.Hydra.Message', {Command: 'ThisIsMyOwnHydraInformation', Values : { HydraInformation : globals.HydraSettings, Beacons: globals.Beacons}});
                }
        }
    }
}

exports.initialize = initialize;
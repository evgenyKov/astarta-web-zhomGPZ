var net = require('net');
	
const getValue = (ip, port, command, init, success, fail, getVes) => {
	console.log("IP, PORT", ip, port);
	const client = new net.Socket();

	client.setTimeout(20*1000, () => fail("Connection Timeout"));

	client.on('data', data => {
		client.destroy();
		const dataStr = data.toString();
		console.log("DATA", dataStr);
		const ves = getVes(dataStr);
		console.log("GETVES", getVes)
		console.log("VES", ves);
		success(parseFloat(ves));
	});
	
	client.on('error', err => {
		console.log("CLIENT ERR", err);
		client.destroy();	
		fail(err);
	});

	client.on('close', () => console.log('Connection closed'));
	
	console.log("INIT", init);
	console.log("COMMAND, COMMAND.LENGTH", command, command.length);
	client.connect(port, ip,  () => {
		if (init)
			client.write(init);
		client.write(command);
	});
}

module.exports = { getValue };

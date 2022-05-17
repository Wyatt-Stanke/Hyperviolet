import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import { bgBlue, bgGreen, bgMagenta } from 'colorette'

const bare =  new Server('/bare/', '');
console.log(bgMagenta("UP!"), "TompHTTP server is up")

const serve = new nodeStatic.Server('static/');
console.log(bgMagenta("UP!"), "Static server is up")

const server = http.createServer();

const average = (array) => array.reduce((a, b) => a + b) / array.length;
let averages = []

setInterval(() => {
	if (averages.length != 0) {
		console.log(`${bgBlue("AVG")} ${Math.round(average(averages))}ms`)
	}
	
	averages = []
}, 60 * 60 * 1000)

server.on('request', (request, response) => {
	// if (request.url != "/bare/v1/") console.log(`${bgGreen("VST")} ${request.headers["x-forwarded-for"]} - ${request.url}`)
	const startMS = Date.now()
	request.on("close", () => {
		averages.push(Date.now() - startMS)
	})
	
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

server.listen(process.env.PORT || 8080);

const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const routes = require("./routes");
let PORT = process.env.PORT || 5000;

const servidorHttp = http.createServer((req,res) => {
	servidorUnico(req,res);
});

const servidorUnico = (req,res) => {
	const urlParseada = url.parse(req.url, true);
	const pathRaw = urlParseada.pathname;
	const pathRawTrim = pathRaw.replace(/^\/+|\/+$/g,"");
	const method = req.method;
	const headers = req.headers;
	const queryStringObject = urlParseada.query;

	//processamento de streaming
	const decodificador = new StringDecoder('utf-8');
	let bufferStringData = new String;

	//listening nos eventos de stream
	req.on('data', streamData => {
		bufferStringData += decodificador.write(streamData);
	});
	req.on('end', () => {
		bufferStringData += decodificador.end();
		
		let sendRoute = typeof masterRouter[pathRawTrim] !== 'undefined' ? masterRouter[pathRawTrim] : masterRouter['notFound'];
		
		const reqData = new Object;

		reqData['body'] = bufferStringData;
		reqData['method'] = method;
		reqData['path'] = pathRawTrim ;
		reqData['params'] = queryStringObject;
		reqData['header'] = headers;

		sendRoute(reqData,res);

	});
};

servidorHttp.listen(PORT, err => {
	if(!err) console.log(`Servidor HTTP ouvindo na porta ${PORT}`);
});

const masterRouter = {
	ping: routes['ping'],
	products: routes['products'],
	notFound: routes['notFound'] 
}

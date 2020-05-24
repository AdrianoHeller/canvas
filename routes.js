const routerHandler = new Object;

routerHandler.ping = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(200);
	res.end(JSON.stringify({"message":"Server running ok"}));
};

routerHandler.notFound = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(404);
	res.end(JSON.stringify({"message":"Data not Found"}));

};

routerHandler.products = (reqData,res) => {
	const requestMethods = ["GET","POST","PATCH","DELETE"];
	const filteredData = requestMethods.filter(mth => mth == reqData['method']);
	console.log(filteredData[0]);
	switch(filteredData[0] != undefined){
		case true:
			routerHandler._products[filteredData[0]](reqData,res);
			break;
		default:
			res.writeHead(405);
			res.end(JSON.stringify({"ERROR":"Invalid HTTP Protocol"}));
			break;
	};
};

routerHandler._products = new Object;

routerHandler._products.POST = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(200);
	res.end(JSON.stringify(reqData));
};

routerHandler._products.GET = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(200);
	res.end(JSON.stringify(reqData));
};

module.exports = routerHandler;

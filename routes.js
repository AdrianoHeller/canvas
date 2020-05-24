const routerHandler = new Object;

routerHandler.ping = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(200);
	res.end(JSON.stringify({"Message":"Server running ok"}));
};

routerHandler.notFound = (reqData,res) => {
	res.setHeader("Content-Type","application/json");
	res.writeHead(404);
	res.end(JSON.stringify({"Message":"Data not Found"}));

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
			res.setHeader("Contenet-Type","application/json");
			res.writeHead(405);
			res.end(JSON.stringify({"ERROR":"INVALID PROTOCOL"}));
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

routerHandler.users = (db,reqData,res) => {
	const acceptedMethods = ["GET","POST","PATCH","DELETE"];
	const filterInputMethod = acceptedMethods.filter( mth => mth == reqData['method']);
	for(let method of filterInputMethod){
		if(method){
			routerHandler._users[method](db,reqData,res)
		}else{
			res.setHeader("Content-Type","application/json");
			res.writeHead(405);
			res.end({"ERROR":"INVALID PROTOCOL"});
		}
	};
};

routerHandler['_users'] = new Object;

routerHandler['_users']['GET'] = async(db,reqData,res) => {
	res.setHeader("Content-Type","application/json")
	const data = await db.getFullData(db)
	if(data[0]['nome']){
		res.writeHead(200);
		res.end(JSON.stringify(data));
	}else{
		res.writeHead(400);
		res.end(JSON.stringify({"Message":"Empty database"}));
	}
}

routerHandler['_users']['POST'] = async(db,reqData,res) => {
	res.setHeader("Content-Type","application/json");
	const { body } = reqData;
	if(body){
		await db.insertData(db,body)
		res.writeHead(200);
		res.end(JSON.stringify({"Message":"Data inserted in Atlas"}));
	}else{
		res.writeHead(500);
		res.end(JSON.stringify({"ERROR":"Internal Server Error"}));
	}
};

routerHandler['_users']['PATCH'] = async(db,reqData,res) => {
	res.setHeader("Content-Type","application/json");
	const { body,params } = reqData;
	if(params['id'] && body){
		await db.updateData(db,params['id'],body);
		res.writeHead(200);
		res.end(JSON.stringify({"Message":"User Data Updated"}));
	}else{
		res.writeHead(500);
		res.end(JSON.stringify({"ERROR":"Internal Server Error"}));
	}
};

routerHandler['_users']['DELETE'] = async(db,reqData,res) => {
	res.setHeader("Content-Type","application/json");
	const { params } = reqData;
	if(params['id']){
		await db.deleteData(db,params['id']);
		res.writeHead(200);
		res.end(JSON.stringify({"Message":"User Data Removed Successfully"}));
	}else{
		res.writeHead(500);
		res.end(JSON.stringify({"ERROR":"Internal Server Error."}));
	}
};

module.exports = routerHandler;

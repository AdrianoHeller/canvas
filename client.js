const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const connection = new Object;
require("dotenv").config();
const strConn = `mongodb+srv://${process.env.API_DB_LOG}:${process.env.API_DB_PWD}@cluster0-qlwln.mongodb.net/test?retryWrites=true&w=majority`
let db = process.env.DB;
let database = process.env.DB_NAME;
let coll = process.env.DB_COLLECTION_NAME;

//Connection Object

connection.make = MongoClient.connect(strConn)
	.then(proxyConn => {
	db = proxyConn.db(database);
		return db
	})
	.then(() => {
		console.log("Mongo Atlas cluster connected.")
	})
	.catch(err => console.error(err));

connection.passDB = () => db;

connection.passID = () => ObjectId;

//Models

const getFullData = conn => new Promise((resolve,reject) => {
	db.collection(coll).find().toArray((err,data) => {
		if(!err){
			resolve(data);
		}else{
			reject(err);
		}
	});
});

const getSpecificData = (conn,id) => new Promise((resolve,reject) => {
	db.collection(coll).findOne({_id:ObjectId(id)},(err,data) => {
		if(!err){
			resolve(data);
		}else{
			reject(err);
		}
	});
});

const insertData = (conn,data) => new Promise((resolve,reject) => {
	db.collection(coll).insert(data,err => {
		if(!err){
			resolve();
		}else{
			reject(err);
		}
	});
});

const updateData = (conn,id,data) => new Promise((resolve,reject) => {
	db.collection(coll).updateOne({_id:ObjectId(id)},{$set:data},err =>{
		if(!err){
			resolve();
		}else{
			reject(err);
		}
	});
});

const deleteData = (conn,id) => new Promise((resolve,reject) => {
	db.collection(coll).deleteOne({_id:ObjectId(id)},err => {
		if(!err){
			resolve();
		}else{
			reject(err);
		}
	});
});


module.exports = {
	connection,
	getFullData,
	getSpecificData,
	insertData,
	updateData,
	deleteData
}


	

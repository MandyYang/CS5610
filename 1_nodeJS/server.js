var express = require('express');
var mongojs = require('mongojs');
var db = mongojs("ex1", ["student"]);

var app = express();

app.get('/', function(req, res){
  res.send('hello world!!!!!!!!!!!!!!!!');
});
app.get('/env',function(req, res){
	res.json(process.env);
})

app.get('/getAllStudent',function(req,res){
	db.student.find(function(err,data){
		res.json(data);	
	});
});


app.get('/getStudentById/:id',function(req,res){
	var id=req.params.id;
	// find a document using a native ObjectId
	db.student.findOne({
    	_id:mongojs.ObjectId(id)
	}, function(err, doc) {
		res.json(doc);
	});
});
	
app.get('/removeStudentById/:id',function(req,res){
	db.student.remove({
	_id:mongojs.ObjectId(req.params.id)
	}, function(err, doc) {
		res.json(doc);
	});
});

app.get('/removeStudentByLastName/:lastName',function(req,res){
	db.student.remove({
	last:req.params.lastName
		},false, function(err, doc) {
		res.json(doc);
	});
});
	
app.get('/createStudent',function(req,res){

	console.log(req.query);
	
	var stu = {
		first:req.query.firstName,
		last:req.query.lastName,
		score:req.query.score
		};

		db.student.insert(stu, function(err, data){
			console.log(err);
			console.log(data);
			res.json(data);
		});
	
});

app.get('/updateStudent/:id',function(req,res){

	console.log(req.query);
	var score=req.query.score;
	
	db.student.findAndModify({
    	query: { _id: mongojs.ObjectId(req.params.id) },
		update: { $set: { score:req.query.score } },
	}, function(err, doc, lastErrorObject) {
		db.student.find(function(err,data){
			res.json(data);
		});
	});
	
});
app.get('/someJson',function(req,res){
	res.json({hello:"world"});
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port  = process.env.OPENSHIFT_NODEJS_PORT || 8080;


app.listen(port,ipaddress);
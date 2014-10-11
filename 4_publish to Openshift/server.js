// load webservice and database libraries
var express = require('express');
var mongojs = require('mongojs');

// instantiate both libraries and connect to the ex2 database
var app = express();
//local
//var db = mongojs("ex2", ["courses"]);


// serve static content (html, css, js) in the public directory
app.use(express.static(__dirname + '/public'));

// configure express to parse JSON in the body of an HTTP request
app.use(express.bodyParser());

var mongodbConnectionString  ="mongodb://admin:pmbxWYBaliH2@127.5.202.2:27017/cs5610";
if (typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined") {
    mongodbConnectionString = "cs5610";
}

var db = mongojs(mongodbConnectionString, ["courses"]);


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port  = process.env.OPENSHIFT_NODEJS_PORT || 3000;


app.listen(port,ipaddress);

app.get('/env',function(req, res){
	res.json(process.env);
});

// map incoming HTTP URL patterns to execute various functions
// handle HTTP GET request to read all courses from the database
app.get("/courses", function (req, res) {
	db.courses.find(function (err, docs) {
		res.json(docs);
	});
});

// handle HTTP POST request to insert new course into the database
app.post("/courses", function (req, res) {
	// the course is in the body of the HTTP request
	console.log(req.body);
	var crs = {
		name: req.body.name,
		section: req.body.section,
		instructor: req.body.instructor,
		classroom: req.body.classroom
		};
	

	// insert new course object into the database collection courses
	db.courses.insert(req.body, function (err, doc) {
		// respond with the new object that has been inserted
		console.log(err);
		console.log(doc);
		res.json(doc);
	});
});


// handle HTTP GET request for a single course with :id parameter
app.get("/courses/:id", function (req, res) {
	console.log(req.params.id);
	// parse id from the path parameter
	var id = req.params.id;
	// select the single document from the database
	db.courses.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
		// respond with the document retrieved from the database
		res.json(doc);
	});
});

// handle HTTP PUT request to update course instance with :id parameter
app.put("/courses/:id", function (req, res) {
	console.log(req.params.id);
	
	db.courses.findAndModify({
		// find the object by id
		query: { _id: mongojs.ObjectId(req.params.id) },
		// new values are in req.body, update it's name
		update: { $set: { name: req.body.name, section:req.body.section, instruction:req.body.instructor, classroom:req.body.classroom } },
		// single one
		new: true
	}, function(err, doc, lastErrorObject) {
		// respond with the new document
		res.json(doc);
	});	
});

// handle HTTP DELETE request to remove a course with :id parameter
app.delete("/courses/:id", function (req, res) {
	// parse id from the path parameter
	var id = req.params.id;
	// find the document by id and remove it
	db.courses.remove({ _id: mongojs.ObjectId(id) },
		function (err, doc) {
			// respond with number of documents affected
			res.json(doc);
		});
});

// listen to port 3000 in localhost
//app.listen(3000);
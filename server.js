// Require the Express Module
var express=require("express");
// Create an Express App
var app=express();
// Require body-parser (to receive post data from clients)
var bodyParser=require("body-parser");
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());
// Require path
var path=require("path");
// Setting our Static Folder Directory
app.use(express.static(__dirname+"./static"));
// Setting our Views Folder Director
app.set('views',path.join(__dirname,'./views'));
// Setting our View Engine set to EJS
app.set('view engine','ejs');

//Require Mongoose
var mongoose=require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quotingDojo');
//Mongoose Schema
var QuotingSchema=new mongoose.Schema({
	name:String,
	quotes:String,
	created_at:{type: Date, default: Date()}
})
//Mongoose Model
mongoose.model('Quotes',QuotingSchema);   //We are setting this schema in our Models as 'User'
var Quotes=mongoose.model('Quotes')      //We are retrieving this Schema from our Models, named 'User'

//Routes
//Root Request
app.get('/',function(req,res){
	// This is where we will retrieve the users from the database and include them in the view page we will be rendering.
      res.render('index');
})
//Add User Request
app.post('/main',function(req,res){
	console.log("Post Data",req.body);
	// This is where we would add the user from req.body to the database.
	var quotes = new Quotes({name: req.body.name, quotes: req.body.quote});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  quotes.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/main');
    }
  })
})
app.get('/main',function(req,res){
	Quotes.find({},function(err,quotes){
		console.log("inside get");
		if(err){
			console.log("something went wrong!!")
		}
		else{
			console.log("successfully retrieved data");
			res.render('main',{quotes:quotes});
		}
		
	})
})
//Setting our Server to Listen on Port:8000
app.listen(8000,function(){
	console.log("listening on port 8000");
})
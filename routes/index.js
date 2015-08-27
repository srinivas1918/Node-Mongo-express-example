var express = require('express');
var router = express.Router();
var dbOparations=require("../config").dbOparations;
var db=dbOparations.db;
var helper=dbOparations.helper;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* login */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST registration pages */
router.get('/register', function(req, res, next) {
  res.render('starter');
});
router.post('/register',function(req,resp,next){
	console.log("**New Registration**");
	db.collection("users").insert(req.body,function(error){
		if(error)
			resp.send({"status":error})
		else
			resp.send({"status":"ok"});
	});
	
});

/* Check username from db */

router.post("/ensureUnique",function(req, resp,next){
	console.log("** Checking username availble **");
	console.log("===>"+JSON.stringify(req.body));
	db.collection("user").find(req.body).toArray(function(er,result){
		console.log("User email check :"+result.length);
		if(result.length==0)
			resp.send({"isAvaileble":true});
		else
			resp.send({"isAvaileble":false});
		
	});
	
	//setTimeout(function(){
   // console.log("waiting userAgent");
	//}, 2000);
	
});

router.post("/authenticate",function(req,resp,next){
	console.log("** authentication**");
	db.collection("user").find(req.body).toArray(function(er,result){
		//var old=req.session;
		// it should print one object only;
		console.log("User Login :"+JSON.stringify(result));
		if(er){
			resp.send({"status":false});
		}
		else{
		if(result.length!=0){
			req.session.valid=true;
			req.session.loggedUser=result[0];
			resp.send({"status":true,"user":result[0]});
				
			}else{
			resp.send({"status":false});	
			}
		}
	});
	
});

router.get("/showUser/:email",function(req,resp,next){
	console.log("Email id param :"+req.params.email);
	db.collection("user").findOne({email:req.params.email},function(err,result){
		
		if(err){
			resp.json({status:"fail",message:result});
		}

		resp.json({status:"ok",message:result});

	});
	
});

router.get("/logout",function(req,resp,next){
	req.session.destroy();
	resp.redirect('/');
});


module.exports = router;

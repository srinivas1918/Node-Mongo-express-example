var express = require('express');
var router = express.Router();
var dbOparations=require("../config").dbOparations;
var db=dbOparations.db;
var helper=dbOparations.helper;

/* GET users listing. */
router.use(function(req, res, next) {
	// check for role access
	console.log("is admin login:"+req.session.valid);
if(req.session.loggedUser.role=='admin')
	 next();
	else
		res.render('error', {
      message: "403 forebidden error",
      error: {status: "Unauthorized access denied..",stack:""}
    });
});

router.get("/dashboard",function(req,resp,next){
	console.log("***Admin dashboard **");
	console.log("** Logged User **"+req.session.loggedUser);
	resp.render("dashboard-adm",{"user":req.session.loggedUser});
});
module.exports = router;
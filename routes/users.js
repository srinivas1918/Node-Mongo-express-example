var express = require('express');
var router = express.Router();

/* GET users listing. */
router.use(function(req, res, next) {
	console.log("is user login:"+req.session.valid);
 next();
});

router.get("/dashboard",function(req,resp,next){
	resp.send({"status":"ok"});
});
module.exports = router;

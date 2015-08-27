var express = require('express');
var router = express.Router();
var dbOparations=require("../config").dbOparations;
var db=dbOparations.db;
var helper=dbOparations.helper;
/* GET users listing. */
router.use(function(req, res, next) {
	// check for role access
	console.log("is admin login:"+req.session.valid);
	next();
});

router.get("/technologies",function(req,resp,next){
	db.collection("technologies").find().toArray(function(err,result){
		if(!err){
			resp.send(result);
		}
	})
});

router.post("/addTechnology",function(req,resp,next){
	
	console.log("*** "+req.body);
	db.collection("technologies").find({"Technology":req.body.Technology},null,{limit:2}).toArray(function(err,result){
		
		console.log(result);
		
		if(err){
			resp.send({"status":"fail","message":err});
		}
		
			if(result.length==0 ){
			
		db.collection("technologies").insert(req.body,function(err,result){
		if(err)
		{
			resp.send({"status":"fail","message":err});
		}
		else{
			resp.send({"status":"ok"});
		}
		console.log("Inserted...");
		
	});
	}else{
		resp.send({"status":"fail","message":"Already exist.."});
	}
	});
	
	
});

router.post("/EditTechnology",function(req,resp,next){
	console.log("Edit Technology Name"+JSON.stringify(req.body.Technology));
	console.log("New Technology Name"+JSON.stringify(req.body.EditTechName));
	db.collection("technologies").update({Technology:req.body.Technology},{$set:{Technology:req.body.EditTechName }},{upsert:true},function(err,result){
	
	console.log(result);
	if(err){
		resp.send({"status":"fail","message":err});
	}
	resp.send({"status":"ok"});	
	});
	
	
});

/* This function returns the both ROLES and Technologies from db as single result */
router.get("/org-skills-roles",function(req,resp,next){
	var orgSkillsAndRoles={};
	var technologies=[];
	db.collection("roles").findOne({},{"_id":0},function(err,result){
		if(err){
			resp.send({"status":"fail","message":err});
		}
		orgSkillsAndRoles.rolesList=result.rolesList;
		// fetching for Technologies
	
		db.collection("technologies").find({},{"_id":0,"Technology":1}).toArray(function(err2,techResult){
			
			if(err2){
				resp.send({"status":"fail","message":err});
			}
			//console.log("tECH RESULT :"+techResult);
			techResult.forEach(function(item){
				console.log("pusthing item :"+item.Technology);
					technologies.push(item.Technology);
			});
			//console.log("Technologies :"+technologies);
			
			orgSkillsAndRoles.technologies=technologies;	
			resp.send({"status":"ok","message":orgSkillsAndRoles});
		});
		
		
	});
});

router.post("/saveUser",function(req,resp,next){
	
	db.collection("user").insert(req.body,function(err,result){
		if(err){
			resp.json({status:"fail",message:err});
		}
		
		console.log(result);
		
		resp.json({status:"ok",message:result});
	});
	
});

router.post("/editUser",function(req,resp,next){
	console.log("Edit User :");
	var query={_id:helper.toObjectID(req.body._id)};
	console.log("=="+JSON.stringify(query));
	db.collection("user").update({_id:helper.toObjectID(req.body._id)},
						{'$set':{fullName:req.body.fullName,empId:req.body.empId,role:req.body.role,skillSet:req.body.skillSet}},
							{upsert:true},function(err,result){
							if(err){
								resp.json({status:"fail",err:err});
							}
						console.log(+JSON.stringify(result));
						resp.json({status:"ok",message:result});

				});
	
});

module.exports = router;
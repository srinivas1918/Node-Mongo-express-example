

app.directive("ensureUnique",['$http','$q','$timeout',function($http,$q,$timeout){
	return{
		require:'ngModel',
		link:function(scope,elem,attr,c){
			c.$asyncValidators.unique=function(modelValue,viewValue){
				console.log("email check :"+modelValue);
				
				if(c.$isEmpty(modelValue)){
					return  $q.when();
				}
				var def=$q.defer();
				//$timeout(function() {
          // Mock a delayed response
         $http.post("/ensureUnique",{"email":modelValue}).success(function(data){
			 console.log("1")
			 if(data.isAvaileble==true)
				 def.resolve();
			 else
				def.reject();

		 });       
      //  }, 2000);
			console.log("2");
				return def.promise;
			}
		}
	}
}]);

/* Root controller */
app.controller("listControlller",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
	$rootScope.technologieslist=[];
	$rootScope.editTechName=""
			$rootScope.showTechnologies=function(){
			
					if($rootScope.technologieslist.length==0){
						$http.get("/org/technologies").success(function(resp){
						$rootScope.technologieslist=resp;
								});
							}
						}
			$scope.formatDate=function(date){
					var d = new Date(date);
					return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
			}	

			$scope.changeTechName=function(techName){
				console.log("Edit Item show");
				$rootScope.techName=techName;
				$("#EditItem").modal('show');
			
			}
	
	
}]);

app.controller("createEmpController",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
	console.log("Inside of Create Emp controller");
	$scope.fullName="";
	$scope.email="";
	$scope.password="";
	$scope.empId="";
	$scope.empRole='';
	$rootScope.empRolesList=[];
	$scope.skillSet=[];
	
	$scope.skill='';
	$rootScope.technologies=[];
	
	

	$http.get("/org/org-skills-roles").success(function(resp){
			console.log(resp);
			if(resp.status=="ok"){
				$rootScope.empRolesList=resp.message.rolesList;
				$rootScope.technologies=resp.message.technologies;
				//$scope.skillSet=$scope.technologies;
				
			}
		});
	
	
	
	$scope.saveUser=function(){
		var user={'fullName':$scope.fullName,'email':$scope.email,'password':$scope.password,'empId':$scope.empId,'role':$scope.empRole,'skillSet':$scope.skillSet};
		console.log("inside of registerUser ");
		$http.post("/org/saveUser",user,{headers:{'Content-Type':'application/json'}}).success(function(resp){
		
			// Message need to be displayed on save of new User.
			// Reset the form.
			$scope.reset();
		});
	};	
		
	$scope.reset=function(){
		console.log("rest clicked...");
		$scope.fullName="";
		$scope.email="";
		$scope.empId="";
		$scope.empRole="";
		$scope.password="";
		for (var i=0;i<$rootScope.technologies.length;i++){
			//console.log("skill_"+i);
			document.getElementById("skill_" + i).checked=false;
		}

		$scope.skillSet=[];
		$scope.registerUser.$setPristine();

	}
		
	$scope.check=function(index,skill,technology){
		console.log("Index :"+index+" is checked"+skill);
			if(skill)
			$scope.skillSet.push($rootScope.technologies[index]);
			else{
				var index=$scope.skillSet.indexOf(technology);
				$scope.skillSet.splice(index,1);
			}				
		
	}
}]);



app.controller("saveTechnology",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
	console.log("Save Technogoy controller");
	$scope.techName="";
	$scope.submitTech=function(isValid){
		if(isValid){
			$("#myModel").modal('hide');
			//alert("adf");
			$http.post("/org/addTechnology",JSON.stringify({Technology:$scope.techName,createdOn:new Date()}),{headers: {'Content-Type': 'application/json'}}).success(function(resp){
			console.log(resp);
			if(resp.status=="ok"){
				$http.get("/org/org-skills-roles").success(function(resp){
			console.log(resp);
			if(resp.status=="ok"){
			
				$rootScope.technologies=resp.message.technologies;  // this is for Emp Creation
				$http.get("/org/technologies").success(function(resp){
					$rootScope.technologieslist=resp;
					});
				
			}
		});
			}
		});
		}
	}
}]);

app.controller("editTechnology",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
	console.log("Edit tech ");
	$scope.newName="";
	$scope.submitEditTech=function(isValid){
					if(isValid){
						$("#EditItem").modal('hide');
						
						$http.post("/org/EditTechnology",JSON.stringify({Technology:$rootScope.techName,EditTechName:$scope.newName}),{headers:{'Content-Type':'application/json'}}).success(function(resp){
							console.log(resp);
							if(resp.status=="ok"){
				$http.get("/org/org-skills-roles").success(function(resp){
			console.log(resp);
			if(resp.status=="ok"){
			
				$rootScope.technologies=resp.message.technologies;  // this is for Emp Creation
				$http.get("/org/technologies").success(function(resp){
					$rootScope.technologieslist=resp;
					});
				
			}
		});
			}
						});
						
					}
	}
}]);

app.controller("editEmpForm",["$scope","$rootScope","$http",function($scope,$rootScope,$http){
	console.log("EditContoller");
	$scope.isEmailValid=false;

	$scope._fullName="";
	$scope._email="";
	
	$scope._empId="";
	$scope._empRole='';
	$scope._empRolesList=[];
	$scope._skillSet=[];
	$scope._skill;	
	var editUserObj={};

	

	$scope.getUser=function(){
		$http.get("/showUser/"+$scope._email).success(function(resp){
			console.log("User Obj :"+resp);
			if(resp.status=='ok' && resp.message!=null){

				editUserObj=resp.message;
				$scope.isEmailValid=true;
				$scope._fullName=resp.message.fullName;
				$scope._empId=resp.message.empId;
				$scope._empRole=resp.message.role;
				$scope._skillSet=resp.message.skillSet;
				for (var i=0;i<$rootScope.technologies.length;i++){
			//console.log("skill_"+i);
					document.getElementById("skillEdit_" + i).checked=false;
				}
				for (var i=0;i<$rootScope.technologies.length;i++){
			//console.log("skill_"+i);
			    for( var j=0;j<$scope._skillSet.length;j++){
			    	
						//var index=$rootScope.technologies.indexOf($scope._skillSet[j]);
						if($scope._skillSet[j]==$rootScope.technologies[i])
						document.getElementById("skillEdit_" +i).checked=true; 

			    }
			
		}
			}else{
				$scope.isEmailValid=false;
			}	
		});
	}

	$scope.editUser=function(){
		editUserObj.role=$scope._empRole;
		editUserObj.skillSet=$scope._skillSet;
		editUserObj.empId=$scope._empId;
		$http.post("/org/editUser",editUserObj,{headers:{"Content-Type":"application/json"}}).success(function(resp){
			console.log(resp);
			if(resp.status=='ok'){
				$scope.reset();
			}
		});
	}

	$scope.check=function(index,skill,technology){
		console.log("Index :"+index+" is checked"+skill);
			if(skill)
			$scope._skillSet.push($rootScope.technologies[index]);
			else{
				var index=$scope._skillSet.indexOf(technology);
				$scope._skillSet.splice(index,1);
			}				
		
	}

	$scope.reset=function(){
		$scope.isEmailValid=false;
		$scope._fullName="";
		$scope._email="";
		$scope._empId="";
		$scope._empRole="";
		$scope._skill='';
		for (var i=0;i<$rootScope.technologies.length;i++){
			//console.log("skill_"+i);
			document.getElementById("skillEdit_" + i).checked=false;
		}
		$scope._skillSet=[];
		$scope.editEmpForm.$setPristine();

	}

}]);


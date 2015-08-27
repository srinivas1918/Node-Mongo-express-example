app.controller("loginController",["$scope","$http","$q","$window",function($scope,$http,$q,$window){
	$scope.email="";
	$scope.password="";
	$scope.errorMsg=false;
	
	$scope.submit=function(){
		//var def=$q.defer();
		$http.post("/authenticate",{"email":$scope.email,"password":$scope.password}).success(function(data){
			console.log(data)
			if(data.status==true){
			if(data.user.role=="admin"){
				$window.location.href="admin/dashboard";
			}else if(data.user.role="dataEntry"){
				$window.location.href="user/dashboard";
			}else{
				// Excecutive role;
				$window.location.href="user";
			}	
			}else{
					$scope.errorMsg=true;
				}		
		})
		
		
	}
	
	
}]);
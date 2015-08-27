$(function(){
	console.log("Ready");

	
	$(".sidebar-menu li:first").addClass("active");
	var sideBarClick=$(".sidebar-menu li:first")
	
	$(".sidebar-menu li").on("click",function(){
		$("#empForm").hide();
		if(sideBarClick==null){
		sideBarClick=$(this);
	}else{
		sideBarClick.removeClass('active');
	}
		$(this).addClass('active');
		sideBarClick=$(this);
	});
	
	
	/* *Tech click   * */
	$("#tech").on("click",function(){
		$("#techBlolck").show();
	});
	
	
	$("#addTechnology").on("click",function(){
		$("#myModel").modal('show');
		
	})
	
	$('#myModel').on('show.bs.modal', function (e) {
	$("#techName").val('');
	});
	
	/*  Emp block code begins from here.  */
	
	$("#emp").on("click",function(){
			console.log("Emp on click ");
		   $("#empForm").show();
		   $("#techBlolck").hide();
		   $("#empCreateForm").hide();
		   $("#editEmpForm").hide();
		   $("#createEmp").css("color","#666");
		   $("#editEmp").css("color","#666");
	});
	
	/* Create Employee.. */
	$("#createEmp").on("click",function(){
		 console.log("Create Emp");
		$("#empCreateForm").show();
		$("#createEmp").css("color","green");
		$("#editEmp").css("color","#666");
		$("#editEmpForm").hide();
	});
	
	$("#editEmp").on("click",function(){
		console.log("edit Emp");
		$("#empCreateForm").hide();
		$("#editEmpForm").show();
		$("#editEmp").css("color","green");
		$("#createEmp").css("color","#666");
	});
	
	
});
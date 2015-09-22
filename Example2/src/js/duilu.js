(function(){
	var extras=[0,1,2,3,4,5];
	function showExtra(id){
		if($("#extra"+id).attr("eid")){
			extras.push($("#extra"+id).attr("eid"));
		}
		var ei=Math.floor(Math.random()*extras.length),front;
		var eid=extras[ei];
		extras.splice(ei,1);
		if($.browser.msie){
			front=2;
		}else{
			front=Math.random()*2;
		}
		$("#extra"+id).removeClass();
		$("#extra"+id).addClass("png extra"+eid);
		$("#extra"+id).attr("eid",eid);
		$("#extra"+id).css({
			top:50+Math.ceil(Math.random()*200)
		})
		if(front>1){
			$("#extra"+id).css({
				"-moz-transform":"",
				'-webkit-transform':'',
				"-o-transform":'',
				transform:"",
				left:$(document).width()
			}).animate({
				left:-200
			},(40*Math.random()+20)*1000,"linear",function(){
				showExtra(id);
			}).children("span").css({
				"-moz-transform":"",
				'-webkit-transform':'',
				"-o-transform":'',
				transform:"",
				right:0
			});
		}else{
			$("#extra"+id).css({
				"-moz-transform":"scaleX(-1)",
				'-webkit-transform':'scaleX(-1)',
				"-o-transform":'scaleX(-1)',
				transform:"scaleX(-1)",
				left:-200
			}).animate({
				left:$(document).width()
			},(40*Math.random()+20)*1000,"linear",function(){
				showExtra(id);
			}).children("span").css({
				"-moz-transform":"scaleX(-1)",
				'-webkit-transform':'scaleX(-1)',
				"-o-transform":'scaleX(-1)',
				transform:"scaleX(-1)",
				right:"auto"
			});
		}
	}

	$(window).load(function() {
		showExtra(1);
		setTimeout(function(){
			showExtra(2);
		},3000);
		for(var i=1;i<5;i++){
			$("#extra"+i).attr("i",i).mouseover(function(){
				$(this).children("span").addClass("png extratip"+Math.floor(Math.random()*5));
			}).mouseout(function(){
				$(this).children("span").removeClass();
			}).click(function(){
				var an;
				if($.browser.msie){
					an={top:Math.random()*$(document).height(),left:-200};
				}else{
					var rd=Math.random()*4,tgl,tgt;
					if(rd<1){
						tgl=Math.random()*$(document).width();
						tgt=-200;
					}else if(rd<2){
						tgl=Math.random()*$(document).width();
						tgt=$(document).height();
					}else if(rd<3){
						tgl=-200;
						tgt=Math.random()*$(document).height();
					}else{
						tgl=$(document).width();
						tgt=Math.random()*$(document).height();
					}
					an={top:tgt,left:tgl};
					if(tgl>parseInt($(this).css("left"))){
						$(this).css({
							"-moz-transform":"scaleX(-1)",
							'-webkit-transform':'scaleX(-1)',
							"-o-transform":'scaleX(-1)',
							transform:"scaleX(-1)"
						}).children("span").css({
							"-moz-transform":"scaleX(-1)",
							'-webkit-transform':'scaleX(-1)',
							"-o-transform":'scaleX(-1)',
							transform:"scaleX(-1)",
							right:"auto"
						});
					}else{
						$(this).css({
							"-moz-transform":"",
							'-webkit-transform':'',
							"-o-transform":'',
							transform:""
						}).children("span").css({
							"-moz-transform":"",
							'-webkit-transform':'',
							"-o-transform":'',
							transform:"",
							right:0
						});
					}
				}
				$(this).stop().animate(an,(Math.random()*4+1)*1000,"linear",function(){
					showExtra($(this).attr("i"));
				});
			});
		}
	});
})();
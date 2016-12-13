function getRefreshTime(el){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	document.getElementById(el).innerHTML = '网页最后刷新于：'+year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
}
getRefreshTime('time');
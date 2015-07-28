// 引入gulp
var gulp		= require('gulp');						// 基础库

// 引入我们的gulp组件
var livereload 		= require('gulp-livereload'),		// 网页自动刷新（服务器控制客户端同步刷新）
	webserver 		= require('gulp-webserver');		// 本地服务器

// 本地服务器
gulp.task('webserver', function() {
	gulp.src( './' )
	.pipe(webserver({
		livereload: true,
		open: true
	}));
});

// 监听任务
gulp.task('watch',function(){
	// 监听 html
	gulp.watch('dist/**/*.html')
});

// 默认任务
gulp.task('default',['webserver','watch']);

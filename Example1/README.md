## Gulp构建前端自动化工作流

### Gulp构建前端自动化工作流：入门介绍及LiveReload的使用

其实这篇内容已躺在我的Evernote里许久，但一直搁置着，今天算是正式见光。

本文主要介绍如何使用Gulp.js，来帮助你构建一个自动化的前端开发流程。总结并归类自身使用中所遇到的方法、问题，便于新人上手和理解，同时也作为一份Gulp参考文档来使用，让你对Gulp有个更深入的了解。

最后，在正文开始前给新人提个醒：随着Gulp版本更新，API已发生了细小变化，目前网上很多文章，都是基于早期版本所写，当你查阅资料时一定要留意一下，否则会给你带来不少麻烦。

> 注：
> 本文所使用的工具版本为：Node.js（v0.10.21）、 Ruby（v2.2.1p85）、Gulp（v3.8.11）。
> 如有疑问欢迎在本文下方留言，或关注我的个人微信号：bluesdream_com

#### Gulp是什么鬼（What's Gulp） ? 

Gulp是基于Node.js的一个构建工具（自动任务运行器），开发者可以使用它构建自动化工作流程（前端集成开发环境）。一些常见、重复的任务，例如：网页自动刷新、CSS预处理、代码检测、压缩图片、等等…… 只需用简单的命令就能全部完成。使用它，可以简化工作，让你把重点放在功能开发上；同时减少人为失误，提高开发效率和项目质量，让专注更为专注。如果你之前接触过Grunt，那上手Gulp就会觉得非常容易理解。

#### 为什么使用Gulp而不使用Grunt（Why use Gulp instead of Grunt）?

构建前端自动化的工具有很多Grunt, Brunch, Broccoli……  而目前过内最流行的属于Grunt，之前我也在用使用，那为什么选择Gulp来代替Grunt？

我简单的总结了以下3点：

* 简洁：Gulp侧重“代码优于配置”(code over configuration)。最直观的感受，更为简单和清晰，不需要像Grunt一样写一堆庞大的配置文件。
* 高效：Gulp基于Node Streams（流）来构建任务，避免磁盘反复I/O（读取/写入）。每个任务都是单独执行（坚持做一件事并且做好它），这使得它速度更快、更为纯粹。
* 易学：Gulp核心API只有4个。简洁的API易于上手，学习过程比较平滑。

Gulp的核心API只有4个：src、dest、task、watch

* gulp.src(globs[, options])：指明源文件路径
globs：路径模式匹配；
options：可选参数；

- gulp.dest(path[, options])：指明处理后的文件输出路径
path：路径（一个任务可以有多个输出路径）；
options：可选参数；

* gulp.task(name[, deps], fn)：注册任务
name：任务名称（通过 gulp name 来执行这个任务）； 
deps：可选的数组，在本任务运行中所需要所依赖的其他任务（当前任务在依赖任务执行完毕后才会执行）； 
fn：任务函数（function方法）；

* gulp.watch(glob [, opts], tasks)：监视文件的变化并运行相应的任务
glob：路径模式匹配；
opts：可以选配置对象；
taks：执行的任务；

在我使用Gulp后，就明显感觉Grunt配置很是复杂。同样为了实现LiveReload功能，Gulp所需要的配置的代码，只有Grunt的一般都不到。具体可以参见我之前所写的一篇文章[《Grunt插件之LiveReload 实现页面自动刷新，所见即所得编辑》](http://www.bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html)与下文进行对比。

> 注：
> 1\. streams（流）的简述：Node.js中的I/O操作是异步的，因此磁盘的读写和网络操作都需要传递回调函数。streams的优点：不需要把文件都一次性写入内存，通过pie（管道）把文件转为数据流（将任务和操作连接起来），像瀑布一样一级级（one by one）往下流（处理），因此只需一次I/O操作。而Grunt是每执行一个任务就需要I/O一次，在任务多的时候，就会有大量I/O操作，效率自然就会比较低。
> 2\. 以前Gulp有5个核心API，但随着Gulp 3.5的更新，gulp.run()方法早已被弃用。

#### 1. 安装Node.js（Install Node.js）

1.1 首先去Node.js官网，点击那个醒目的"INSTALL"按钮，下载并安装。

1.2 安装完成以后，打开命令行`（Winkey+R  -> 输入CMD）`or`（开始菜单 -> 所有程序  -> 选择命令提示符）`，执行以下2个简单的命令，查看Node.js是否已经安装正确：

`node -v`

查看 Node.js 版本号

`npm -v`

查看 npm 版本号

>注：
>现在的Node.js会自动安装npm（npm 是 Node.js 的包管理器，Gulp和Gulp插件就通过 npm 安装并管理）。

#### 2. 创建项目目录（Create Project）

2.1 假设这个项目存放在D盘（"D:\my-gulp"），我们首先进度D盘：

`d:`

2.2 然后进入文件夹：

`cd my-gulp`

#### 3. Gulp安装（Installing Gulp）

3.1 全局安装：

`npm install -g gulp`

安装完成后，我们同样可以通过 `gulp -v` 命令，来查看Gulp的版本号。
这时项目文件夹中生成了一个node_modules文件夹，其里面就是对应的Gulp和Gulp插件。

> 注：
> 1\. Gulp全局安装后，并不能像Grunt一样，只需安装一次就能在任何目下执行。他在每构建一个新项目时，都需要从这步骤开始再单独安装一次。
> 2\. 至于为什么要这样，有人在stackoverflow上提出过疑问。得到的大致回复是为了更加灵活，因为有些插件基于特定的版本，这样做的话每个项目就等于都是独立的，互不影响。

3.2 本地安装：

`npm install gulp --save-dev`

> 注：
> 1\. -g：代表全局安装；
> 2\. --save：将保存配置信息至package.json（此文件在 node_modules\gulp 目录下）
> 3\. -dev：将它作为你的项目依赖添加到中devDependencies内（--save和-dev是2个东西，记得分清前面的"-"号）
> 4\. 由于Gulp会自带package.json文件（用于存储项目的元数据），所以这里只做简单介绍（如果你想自己创建，也可通过命令 npm init，然后根据引导填写相关信息）：
```
{
     "name": "gulp", // 模块名称：只能包含小写字母数字和中划线，如果为空则使用项目文件夹名称代替（必填）
     "version": "3.8.11", // 版本号（必填）
     "description": "The streaming build system", // 描述：会在npm搜索列表中显示（必填）
     "homepage": "http://gulpjs.com", // 项目主页
     "repository": { // 资源库
           "type": "git",
           "url": "git://github.com/gulpjs/gulp"
     },
          "author": { // 作者信息
                "name": "Ryan",
                "email": "contact@bluesdream.com",
                "url": "http://www.bluesdream.com/"
     },
          "licenses": [{ // 开源协议
               "type": "MIT",
               "url": "https://raw.githubusercontent.com/gulpjs/gulp/master/LICENSE"
          }],
          "devDependencies": { // 这里面的参数，指定了项目依赖的Gulp和Gulp插件版本。
                "gulp": "^3.8.11"
     }
}
```

#### 4. Gulp插件安装（Install Gulp Plugins）

接着安装我们所需要的插件，这里，我们通过`gulp-livereload` + `gulp-webserver`，来实现页面自动刷新：

**静态服务器（ [gulp-webserver](http://www.example.com) ）**
**网页自动刷新（ [gulp-livereload](https://www.npmjs.com/package/gulp-livereload) ）**

`npm instal gulp-livereload gulp-webserver --save-dev`

#### 5. Gulp任务配置（Task Configuration）

5.1 在项目根目录中，创建gulpfile.js文件，用来配置和定义任务（task）。

5.2 打开Gulpfile.js文件中，填写相关配置：
```
// 引入gulp
var gulp = require('gulp');				// 基础库

// 引入gulp插件
var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'); // 本地服务器

// 注册任务
gulp.task('webserver', function() {
	gulp.src( './' ) // 服务器目录（./代表根目录）
	.pipe(webserver({ // 运行gulp-webserver
		livereload: true, // 启用LiveReload
		open: true // 服务器启动时自动打开网页
	}));
});

// 监听任务
gulp.task('watch',function(){
	gulp.watch( '*.html', ['html']) // 监听根目录下所有.html文件
});

// 默认任务
gulp.task('default',['webserver','watch']);
```

5.2.1 执行默认：

`gulp`

看到如下提示说明执行成功：
> [18:19:24] Using gulpfile D:\my-gulp\gulpfile.js
> [18:19:24] Starting 'webserver'...
> [18:19:24] Webserver started at http://localhost:8000
> [18:19:24] Finished 'webserver' after 10 ms
> [18:19:24] Starting 'watch'...
> [18:19:24] Finished 'watch' after 97 ms

想要终止任务，只需`Ctrl+c`根据提示输入`y`便能终止，或直接关闭命令提示符。

5.2.2 执行特定任务：

`grunt webserver`

看到如下提示说明执行成功：
> [18:21:56] Using gulpfile D:\my-gulp\gulpfile.js
> [18:21:56] Starting 'webserver'...
> [18:21:56] Webserver started at http://localhost:8000
> [18:21:56] Finished 'webserver' after 10 ms

至此，你已轻松学会如何使用Gulp，并对它有一个大致的了解。

> 注：
> 1\. Gulp插件可以通过[Gulp官网](http://gulpjs.com/plugins/) 、 [npm官网](https://www.npmjs.com/browse/keyword/gulpplugin/) 或 [Browsenpm](http://browsenpm.org/) 上找到你所要的插件。
> 2\. 不要在node_modules文件夹内手动删除插件，请使用命令卸载。因为手动删除的只是下载插件包，但package.jason中的配置信息并没有清除。
> 3\. 不要直接移动Gulp插件，否则由于系统层级限制，出现错误提示“文件名对目标文件夹可能过长。您可以缩短文件名并重试，或者尝试路径较短的位置。”。此时把文件夹打包成RAR后再操作便可。
> 4\. npm常用命令：
> 安装插件：npm <module> [-g] [--save-dev]
> 更新插件：npm update <module> [-g] [--save-dev]
> 卸载插件：npm uninstall <module> [-g] [--save-dev]
> 指定版本：npm install <module>@VERSION [--save-dev] （其中VERSION就是你所需要的版本号）

参考资料：
[Building With Gulp](http://www.smashingmagazine.com/2014/06/11/building-with-gulp/)
[Introduction to Gulp.js – Code Over Configuration](http://gaboesquivel.com/blog/2014/introduction-to-gulpjs/)
[An introduction to Gulp](http://www.codeproject.com/Articles/865943/An-introduction-to-Gulp)

扩展资料：
[Gulp API docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md)
[gulp-cheatsheet](https://github.com/osscafe/gulp-cheatsheet)

原文地址：[Gulp构建前端自动化工作流之：入门介绍及LiveReload的使用](http://www.bluesdream.com/blog/gulp-frontend-automation-introduction-and-livereload.html)

## Gulp构建前端自动化工作流

### Gulp构建前端自动化工作流之：常用插件介绍及使用

在对Gulp有了一个初步的了解之后，我们开始构建一个较为完整的Gulp开发环境。

本文主要分为6个段落：

* 1\. 构建项目目录结构（Directory Structure Build）
* 2\. 插件介绍及使用方法（Tasks and dependencies）
* 3\. 扩展优化（Extend & Optimize Task）
* 4\. 其他插件介绍（Other plug-ins）
* 5\. 匹配规则（Match Files）
* 6\. 注意事项（Attention）

关于Gulp的入门介绍及安装方法，可先去[《Gulp构建前端自动化工作流之：入门介绍及LiveReload的使用》](http://www.bluesdream.com/blog/gulp-frontend-automation-introduction-and-livereload.html "Gulp构建前端自动化工作流之：入门介绍及LiveReload的使用") 这篇文章查看。对其有个初步认识后，便于后文的理解。<!--more-->

### 1. 构建项目目录结构（Directory Structure Build）

```js
+ my-gulp（项目文件夹）
  + node_modules Gulp组件目录
  + dist 发布环境
  + css 编译后的CSS文件
    ─ etc...
  + images 压缩后的图片文件
    ─ etc...
  + js 编译后的JS文件
    ─ etc...
　　─ html 静态文件
  + src 开发环境
  + sass SASS文件
    ─ etc...
  + images 图片文件
    ─ etc...
  + js JS文件
    ─ etc...
  ─ html 静态文件
  ─ gulpfile.js Gulp任务文件

注：
+ 表示目录  ─ 表示文件
```

### 2. 插件介绍及使用方法（Tasks and dependencies）

#### 2.1 HTML处理（HTML Task）

仅把开发环境中的HTML文件，移动至发布环境。

基础配置：
```js
gulp.task('html', function() {
  return gulp.src('src/**/*.html') // 指明源文件路径、并进行文件匹配
    .pipe('dist'); // 输出路径
});
```

执行命令：
`gulp html`

#### 2.2 样式处理（CSS Task）

##### CSS预处理/Sass编译 ([gulp-ruby-sass](https://www.npmjs.com/package/gulp-ruby-sass)) ：

相比较glup-sass而言，速度会稍许慢点，但功能更多并且稳定。

安装SASS：
1. 像Gulp基于Node.js一样，Sass基于Ruby环境，所以我们先去官网下载并安装[Ruby](http://rubyinstaller.org/downloads)（在安装的时候，请勾选`Add Ruby executables to your PATH`这个选项，添加环境变量，不然以后使用编译软件的时候会提示找不到ruby环境）。
2. 安装完ruby之后，在开始菜单中，找到刚才我们安装的ruby，打开`Start Command Prompt with Ruby`
3. 然后直接在命令行中输入`gem install sass`按回车键确认，等待一段时间就会提示你sass安装成功。

> 注：
由于近期墙的比较严重，外加（上海）电信限制了外网访问速度。如果安装失败，请使用淘宝的Ruby镜像。具体操作方法请参考[淘宝RubyGems镜像安装 sass](http://www.w3cplus.com/sassguide/install.html)。

安装命令：
`npm install gulp-ruby-sass --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var sass = require('gulp-ruby-sass'); // sass/scss编译

gulp.task('sass', function () {
     return sass('src/css', { style: 'compressed' }) // 指明源文件路径、并进行文件匹配（style: 'compressed' 表示输出格式）
          .on('error', function (err) {
               console.error('Error!', err.message); // 显示错误信息
          })
          .pipe(gulp.dest('dist/css')); // 输出路径
});
```

执行命令：
`gulp sass`

插件提供4种输出格式：
nested：嵌套缩进的css代码，它是默认值。
expanded：没有缩进的、扩展的css代码。
compact：简洁格式的css代码。
compressed：压缩后的css代码。

> 注：
> 使用前清看清 gulp-ruby-sass 写法，不要直接拿 gulp-sass 的写法来套用，两者并不完全相同。

#### 2.3 脚本压缩&重命名（Javascript Task）

##### JS文件压缩([gulp-uglify](https://www.npmjs.com/package/gulp-uglify))：

使用uglify引擎压缩JS文件。

安装命令：
`npm install gulp-uglify --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var uglify = require('gulp-uglify'); // js压缩

gulp.task('script', function() {
  return gulp.src('src/js/*.js') // 指明源文件路径、并进行文件匹配
    .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
    .pipe(gulp.dest('dist/js')); // 输出路径
});
```

执行命令：
`gulp script`

#### 2.4 图片处理（Image Task）

##### 图片压缩([gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)) + 深度压缩([imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant))：

压缩PNG、JPEG、GIF和SVG图像。
gulp-imagemin集成了[gifsicle](https://github.com/kevva/imagemin-gifsicle) 、[jpegtran](https://github.com/kevva/imagemin-jpegtran) 、[optipng](https://github.com/kevva/imagemin-optipng) 、[svgo](https://github.com/kevva/imagemin-svgo) 这4个插件。而imagemin-pngquant是imagemin插件的一个扩展插件，用于深度压缩图片。

安装命令：
`npm install gulp-imagemin imagemin-pngquant --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var imagemin = require('gulp-imagemin'), // 图片压缩
  pngquant = require('imagemin-pngquant'); // 深度压缩

gulp.task('images', function(){
  return gulp.src('src/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    }))
    .pipe(gulp.dest('dist/images')); // 输出路径
});
```

执行命令：
`gulp images`

> 注：
> 一般我们所使用的图片压缩方法，都会对图像造成一定的损失，这个和压缩比率有一定的关系。通常我们所说的无损压缩，也只是控制在我们肉眼难以发现的范围内。换句话来说，在你保存切图的同时，其实已经对图像造成了一定的损失，因为没什么人会选择100%最佳质量导出图片。两者是差不多的概念。


#### 2.5 自动刷新（LiveReload Task）

##### 网页自动刷新（文件变动后即时刷新页面）([gulp-livereload](https://www.npmjs.com/package/gulp-livereload)) + 静态服务器：([gulp-webserver](https://www.npmjs.com/package/gulp-webserver))：

安装命令：
`npm install gulp-livereload gulp-webserver --save-dev`

```js
var gulp = require('gulp'); // 基础库
var livereload = require('gulp-livereload'), // 网页自动刷新（文件变动后即时刷新页面）
  webserver = require('gulp-webserver'); // 本地服务器

// 注册任务
gulp.task('webserver', function() {
  gulp.src( '.' ) // 服务器目录（.代表根目录）
  .pipe(webserver({ // 运行gulp-webserver
    livereload: true, // 启用LiveReload
    open: true // 服务器启动时自动打开网页
  }));
});

// 监听任务
gulp.task('watch',function(){
  // 监听 html
  gulp.watch('src/**/*.html', ['html'])
  // 监听 scss
  gulp.watch('src/scss/*.scss', ['css']);
  // 监听 images
  gulp.watch('src/images/**/*.{png,jpg,gif,svg}', ['images']);
  // 监听 js
  gulp.watch('src/js/*.js', ['script']);
});
 
// 默认任务
gulp.task('default',['webserver','watch']);
```

执行命令：
`gulp`

### 3. 扩展优化（Extend & Optimize Task）

至此，`一套简单的前端自动化工作流/Gulp工作流便已经完成`。现在，我们开始优化并扩展这些插件，使我们的工作流更为"智能"。

##### 3.1 文件重命名([gulp-rename](https://www.npmjs.com/package/gulp-rename))：
像jQuery一样，通常为了表示该文件是压缩版，会在文件名后加上 .min 后缀。

安装命令：
`npm install gulp-rename --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var uglify = require('gulp-uglify'), // js压缩
  rename = require('gulp-rename'); // 文件重命名

gulp.task('script', function() {
  return gulp.src('src/js/*.js') // 指明源文件路径、并进行文件匹配
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
    .pipe(gulp.dest('dist/js')); // 输出路径
});
```

执行命令：
`gulp script`

##### 3.2 来源地图([gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps))：
这是个非常有用的插件，我们在压缩、合并等操作之后，调试时所看到的内容，都是编译后的代码。这样就导致一个问题，调试过程中无法和源码（编译时的代码）位置相对应，让调试变的十分困难。
例如：一个jQuery，源码接近1万行。但压缩后只有短短的3~4行，并且变量名称也已发生改变。此时一旦报错，你很难从错误信息中直接找到对应代码的原始位置。同样，CSS也会遇到类似问题。
而sourcemaps作用，便是成一个`.map`文件，里面储存着对应的源码位置。并内嵌在你转换后的文件底部`/*# sourceMappingURL=maps/filename.css.map */`。这样在我们调试时，就会直接显示（映射）源码，而不时编译后的代码。

安装命令：
`npm install gulp-sourcemaps --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var uglify = require('gulp-uglify'), // js压缩
  rename = require('gulp-rename'), // 文件重命名
  sourcemaps = require('gulp-sourcemaps'); // 来源地图

gulp.task('script', function() {
  return gulp.src(['src/js/*.js','!*.min.js']) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
    .pipe(sourcemaps.init()) // 执行sourcemaps
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
    .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
    .pipe(gulp.dest('dist/js')); // 输出路径
});
```

执行命令：
`gulp script`

##### 3.3 只操作有过修改的文件([gulp-changed](https://www.npmjs.com/package/gulp-changed))：
比如我们有20个文件，当你修改其中1个文件时，由于任务的局限性，也会把其余19匹配的无辜的同类给一并进行处理，这样就大大降低了效率。而 `gulp-changed` 插件，会首先把文件进行比对，如果文件没有改动，则跳过后续任务。

安装命令：
`npm install gulp-changed --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var imagemin = require('gulp-imagemin'), // 图片压缩
  pngquant = require('imagemin-pngquant'), // 深度压缩
  changed = require('gulp-changed'); // 只操作有过修改的文件

gulp.task('images', function(){
  return gulp.src('src/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
    .pipe(changed('dist/images')) // 对比文件是否有过改动（此处填写的路径和输出路径保持一致）
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    }))
    .pipe(gulp.dest('dist/images')); // 输出路径
});
```

执行命令：
`gulp images`

此时我们再去 `dist/images` 文件夹，查看每个图片的最后修改日期，你就会发现只针对你刚才修改过的图片（文件）行了处理，而那些之前已经处理过的图片则没有再进行操作。

> 注：
无论是 gulp-changed 还是下文中提到的 gulp-cache ，对 sass 文件无效，始终会对所有匹配文件进行操作。

##### 3.4 文件合并([gulp-concat](https://www.npmjs.com/package/gulp-concat))：
比如我们有多个JS库，jquery.min.js、bootstrap.min.js、angular.min.js。此时可以通过合并，减少网络请求。

安装命令：
`npm install gulp-concat --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var concat = require("gulp-concat"); // 文件合并
 
gulp.task('concat', function () {
    gulp.src('js/*.min.js')  // 要合并的文件
    .pipe(concat('libs.js'))  // 合并成libs.js
    .pipe(gulp.dest('dist/js'));
});
```

执行命令：
`gulp concat`

##### 3.5 文件清理([gulp-clean](https://www.npmjs.com/package/gulp-clean))：
简单的说，就是一键删除（清理）文件。就拿为了调试所生成的 .map 文件为例，在正式发布时并不需要，此时我们就能通过 clean任务进行清理。

安装命令：
`npm install gulp-clean --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var clean = require('gulp-clean'); // 文件清理

gulp.task('clean', function() {
  return gulp.src(['dist/css/maps','dist/js/maps'], {read: false})
    .pipe(clean());
});
```

执行命令：
`gulp clean`

### 4. 其他插件介绍（Other plug-ins）

这部分插件作为扩展阅读，只做简单介绍。每个插件都有每个插件的特性，根据你的喜好和实际操作环境而定，萝卜青菜各有所爱。用的人最多的，不代表就是适合你的。总之，有时间有精力的，可以多试试，多玩玩，多配配，这里也只是冰山一角。

#### 4.1 CSS类

##### 1. CSS压缩 ([gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css))

安装命令：
`npm install gulp-minify-css --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var minifyCss = require('gulp-minify-css'); // CSS压缩

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(gulp.dest('dist'));
});
```

执行命令：
`gulp minify-css`

##### 2. CSS预处理/Less编译 ([gulp-less](https://www.npmjs.com/package/gulp-less))

安装命令：
`npm install gulp-autoprefixer --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var less = require('gulp-less'); // LESS编译

gulp.task('less', function () {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});
```

执行命令：
`gulp less`

##### 3. 自动添加CSS3浏览器前缀([gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)):

[-prefix-free](http://leaverou.github.io/prefixfree/) 大家肯定都比较熟，会自动为CSS添加上浏览器的前缀，帮你摆脱前缀痛苦。而 `gulp-autoprefixer` 插件同样如此。

安装命令：
`npm install gulp-autoprefixer --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀

gulp.task('prefix', function () {
    gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

var gulp = require('gulp'); // 基础库
var sass = require('gulp-ruby-sass'), // sass/scss编译
  autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀

gulp.task('sass', function () {
  return sass('src/css', { style: 'compressed' }) // 指明源文件路径、并进行文件匹配
    .on('error', function (err) {
      console.error('Error!', err.message); // 显示错误信息
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
      cascade: false // 是否美化属性值
    }))
    .pipe(gulp.dest('dist/css')); // 输出路径
});
```

执行命令：
`gulp sass`

#### 4.2 图像类

##### 1. 使用TinyPN API压缩图片([gulp-tinypng](https://www.npmjs.com/package/gulp-tinypng))：
使用TinyPNG官方API进行图片压缩。我个人比较喜欢这个，因为之前一直有在使用。但由于TinyPNG服务器在国外，有时执行起来会很慢，除非你有VPN，所以在这只做简单介绍。
经过我的测试，gulp-tinypng压缩后的图片大小，相当于使用imagemin-pngquant深度压缩后的大小。使用时需先注册TinyPNG账户，获你的API KEY。免费版每个月可以压缩500张图片，对于一般项目而言已经足够。

安装命令：
`npm install gulp-tinypng --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var tinypng = require('gulp-tinypng'); // 使用TinyPN API压缩图片

gulp.task('tinypng', function(){
    return gulp.src('src/images/**/*') // 源地址
     .pipe(tinypng('填写TinyPN API KEY'))
    .pipe(gulp.dest('dist/images')); // 输出路径
});
```

执行命令：
`gulp tinypng`

#### 4.3 其他

##### 1. 缓存代理([gulp-cache](https://www.npmjs.com/package/gulp-cache))：
缓存操作过的文件，当文件修改时，只编译当前修改的文件。其余文件直接从缓存中调取，提高效率。
缺点：因为是缓存，所以如果文件被删除，但没及时清理缓存文件时，就会导致被删除的文件又从缓存中读取了出来，所谓成也萧何败也萧何。

安装命令：
`npm install gulp-cache --save-dev`

基础配置：
```js
var gulp = require('gulp'); // 基础库
var imagemin = require('gulp-imagemin'), // 图片压缩
  pngquant = require('imagemin-pngquant'), // 深度压缩
  pngquant = require('imagemin-cache'), // 缓存代理
  clean = require('imagemin-clean'); // 文件清理

// imagemin 图片压缩（利用cache）
gulp.task('images', function(){
  return gulp.src('src/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
    .pipe(cache(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不要移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    })))
    .pipe(gulp.dest('dist/images')); // 输出路径
});
// 清理缓存文件
gulp.task('clean', function (done) {
  return cache.clearAll(done);
});
```

### 5. 匹配规则（Match Files）

Gulp使用 [node-glob](https://github.com/isaacs/node-glob) 模块，借助 [minimatch](https://github.com/isaacs/minimatch) 库，将glob表达式(glob expressions)转换成JavaScript正则表达式(JavaScript RegExp) ，从而实现文件匹配功能。我们所看到的`**`和`*`都是其所提供的语法：

`*` 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾。
`**` 匹配路径中的0个或多个目录及其子目录，需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
`?` 匹配文件路径中的一个字符(不会匹配路径分隔符)。
`[...]` 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为`^`或`!`时，则表示不匹配方括号中出现的其他字符中的任意一个。
`!(pattern|pattern|pattern)` 匹配任何与括号中给定的任一参数一致的都不匹配的。
`?(pattern|pattern|pattern)` 匹配括号中给定的任一参数0次或1次。
`+(pattern|pattern|pattern)` 匹配括号中给定的任一参数至少1次。
`*(a|b|c)` 匹配括号中给定的任一参数0次或多次。
`@(pattern|pat*|pat?erN)` 匹配括号中给定的任一参数1次。

用实例来加深理解：
`*` 能匹配 `a.js` , `x.y` , `abc , abc/`，但不能匹配 a/b.js
`*.*` 能匹配 `a.js` , `style.css` , `a.b` , `x.y`
`*/*/*.js` 能匹配 `a/b/c.js` , `x/y/z.js`，不能匹配 `a/b.js` , `a/b/c/d.js`
`**` 能匹配 `abc` , `a/b.js` , `a/b/c.js` , `x/y/z` , `x/y/z/a.b`，能用来匹配所有的目录和文件
`**/*.js` 能匹配 `foo.js` , `a/foo.js` , `a/b/foo.js` , `a/b/c/foo.js`
`a/**/z` 能匹配 `a/z` , `a/b/z` , `a/b/c/z` , `a/d/g/h/j/k/z`
`a/**b/z` 能匹配 `a/b/z , a/sb/z`，但不能匹配 `a/x/sb/z`，因为只有单`**`单独出现才能匹配多级目录
`?.js` 能匹配 `a.js` , `b.js` , `c.js`
`a??` 能匹配 `a.b` , `abc`，但不能匹配 `ab/`，因为它不会匹配路径分隔符
`[xyz].js` 只能匹配 `x.js` , `y.js` , `z.js`，不会匹配 `xy.js` , `xyz.js` 等，整个中括号只代表一个字符
`[^xyz].js` 能匹配 `a.js` , `b.js` , `c.js`等，不能匹配 `x.js` , `y.js` , `z.js`

当有多种匹配模式时可以使用数组：
```js
// 使用数组的方式来匹配多种文件
gulp.src(['js/*.min.js','css/*.min.css'])
```

使用数组的方式还有一个好处就是可以很方便的使用排除模式，在数组中的单个匹配模式前加上`!`即是排除模式，它会在匹配的结果中排除这个匹配，要注意一点的是不能在数组中的第一个元素中使用排除模式：
```js
// 使用数组的方式来匹配多种文件
gulp.src(['*.js','!b*.js']) // 匹配所有js文件，但排除掉以b开头的js文件
gulp.src(['!b*.js',*.js]) // 不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
```

此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开的模式相加起来得到的结果。展开的例子如下：
`a{b,c}d` 会展开为 `abd,acd`
`a{b,}c` 会展开为 `abc,ac`
`a{0..3}d` 会展开为 `a0d`,`a1d`,`a2d`,`a3d`
`a{b,c{d,e}f}g` 会展开为 `abg`,`acdfg`,`acefg`
`a{b,c}d{e,f}g` 会展开为 `abdeg`,`acdeg`,`abdeg`,`abdfg`

### 6. 注意事项（Attention）

* watch 的时候路径不要用 './path'，直接使用 '/path' 即可不然会导致新增文件无法被 watch。
* gulp 对于 one after one 的任务链，需要加 return，比如 gulp clean

参考资料：
[An introduction to Gulp](http://www.codeproject.com/Articles/865943/An-introduction-to-Gulp)
[gulp API 介绍](http://www.cnblogs.com/2050/p/4198792.html#part3)

扩展资料：
[Gulp API docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md)
[gulp-cheatsheet](https://github.com/osscafe/gulp-cheatsheet)
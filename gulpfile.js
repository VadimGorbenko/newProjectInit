var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	pug = require('gulp-pug'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify');

gulp.task('pugBlocks', function(){
	return gulp.src(['dev/blocks/**/*.pug','!dev/blocks/blocks.pug', '!dev/blocks/bemto/lib/*'])
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return{
				title:"Pug blocks",
				message:err.message
			}
		})
	}))
	.pipe(concat('blocks.pug', {newLine: '\r\n\r\n'}))
	.pipe(gulp.dest('dev/blocks/'))
	.pipe(browserSync.stream())
});

gulp.task('pug',['pugBlocks'], pagesCompiler);
function pagesCompiler(){
	return gulp.src('dev/pages/*.pug')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return{
				title:"Pug pages",
				message:err.message
			}
		})
	}))
	.pipe(pug({
		// pretty:true,
		pretty: '\t'
	}))
	.pipe(gulp.dest('prod/'))
	.pipe(browserSync.stream())
};

gulp.task('less', function(){
	return gulp.src('dev/blocks/**/*.less')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return{
				title:"Less",
				message:err.message
			}
		})
	}))
	.pipe(concat('styles.less'))
	.pipe(less())
	.pipe(autoprefixer({
            browsers: ['last 15 versions', 'ie >= 9']
        }))
	.pipe(gulp.dest('prod/css/'))
	.pipe(browserSync.stream())	
});

gulp.task('img', function(){
	return gulp.src('dev/blocks/**/*.{png,jpg,svg}')
	.pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest('prod/img/'))	
});

gulp.task('server',['pug','less','img'], function(){
	browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'prod' // Директория для сервера - prod
        },
        notify: true // уведомления
    });
   	gulp.watch(['dev/blocks/**/*.pug','!dev/blocks/blocks.pug'],['pugBlocks']);
   	gulp.watch('dev/blocks/blocks.pug').on('change', pagesCompiler);
	gulp.watch('dev/pages/*.pug',['pug']);
	gulp.watch('dev/blocks/**/*.less',['less']);
	gulp.watch('dev/blocks/**/*.{png,jpg,svg}',['img']);
	gulp.watch('dev/blocks/**/*.{png,jpg,svg}').on('change', browserSync.reload);
});

// gulp.task('watcher', function(){
// 	gulp.watch(['dev/blocks/**/*.pug','!dev/blocks/blocks.pug'],['pugBlocks']);
// 	gulp.watch('dev/pages/*.pug',['pug']);
// 	gulp.watch('dev/blocks/**/*.less',['less']);
// 	gulp.watch('dev/blocks/**/*.{png,jpg,svg}',['img']);
// });

gulp.task('default',['server']);
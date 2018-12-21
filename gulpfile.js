'use strict';

let gulp       		= require( 'gulp' ), 
	plumber			= require( 'gulp-plumber' ),
	sass			= require( 'gulp-sass' ),
	postcss			= require( 'gulp-postcss' ),
    posthtml        = require( 'gulp-posthtml' ),
    include         = require( 'posthtml-include' ),
	autoprefixer	= require( 'autoprefixer' ),
	minify 			= require('gulp-csso'),
    imagemin        = require('gulp-imagemin'),
    svgstore        = require('gulp-svgstore'),
    rename          = require('gulp-rename'),
    wait            = require( 'gulp-wait' ),
    server          = require('browser-sync').create();

    

let path = {
    build: {
        js:         './build/js/',
        css:        './build/css/',
        img:        './build/images/',
        svg:        './build/svg/',
        fonts:      './build/fonts/'
    },
    src: {
        js:         './sources/js/*.js',
        scss:       './sources/scss/*.scss',
        css:        './sources/css/',
        img:        './sources/images/*.*',
        svg:        './sources/svg/*.svg',
        fonts:      './sources/fonts/*.*',
        html:        './sources/*.html',
    },
    source:        './sources',
    
    clean:    './build',
};

gulp.task('style', function(done)  { 
   gulp.src(path.src.scss)

   .pipe(plumber())    
   .pipe(sass({errLogToConsole: true}))

   .pipe(postcss([
        autoprefixer()
    ]))

    .pipe( gulp.dest(path.src.css))
    .pipe(minify())
    .pipe(rename('style.min.css'))

    .pipe( gulp.dest(path.src.css))
    .pipe(server.stream());
    

    done()
});

gulp.task('images', function (done) { 

    return gulp.src(path.src.img)

    .pipe(imagemin([ 
      imagemin.optipng({optimizationLevel: 3}), 
      imagemin.jpegtran({progressive: true}), 
      imagemin.svgo() 
    ]))

    .pipe(gulp.dest(path.build.img));

    done()
});

gulp.task('svg', function (done) { 
 
 done()
});

gulp.task('sprite', function (done) { 
    return gulp.src('path.src.svg/icon-*.svg')

    .pipe(svgstore({ 
      inlineSvg: true 
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(path.build.svg));

    done()
});

gulp.task('html', function () { 
  return gulp.src(path.src.html) 
    .pipe(posthtml([
             include()
        ]))
    .pipe(gulp.dest(path.source)); 
});

gulp.task("copy", function () { 
  return gulp.src([ 
      'path.src.svg{woff,woff2}', 
      'path.src.img', 
      'path.src.svg' ,
      'path.src.html'
    ], { 
      base: path.source 
    }) 
    .pipe(gulp.dest(  'build')); 
});

gulp.task('server', gulp.series('style', function()  { 
   
    server.init ({
        server: path.source
    });
    
    gulp.watch(path.src.scss, gulp.series('style'));
    gulp.watch(path.src.html).on('change', server.reload);

}));

gulp.task('server', gulp.series('style', function()  { 

}));


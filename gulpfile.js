//let projectname = 'name';
let preprocessor = 'sass'; // Preprocessor (sass, scss, less, styl)
let fileswatch   = 'html,htm,txt,json,md,woff2'; // List of files extensions for watching & hard reload (comma separated)
let imageswatch  = 'jpg,jpeg,png,webp,svg'; // List of images extensions for watching & compression (comma separated)

const { src, dest, parallel, series, watch } = require('gulp');
const sass           = require('gulp-sass');
const scss           = require('gulp-sass');
const less           = require('gulp-less');
const styl           = require('gulp-stylus');
const cleancss       = require('gulp-clean-css');
const concat         = require('gulp-concat');
const browserSync    = require('browser-sync').create();
const uglify         = require('gulp-uglify-es').default;
const autoprefixer   = require('gulp-autoprefixer');
const imagemin       = require('gulp-imagemin');
const newer          = require('gulp-newer');
const rsync          = require('gulp-rsync');
const del            = require('del');

//need command 'gulp-clean'
//function cleanassets() {
//	return del('app/dist/assets/**/*', { force: true })
//}

// Local Server
function browsersync() {
	browserSync.init({
		server: { baseDir: 'app/dist' },
		notify: false,
		// online: false, // Work offline without internet connection
	})
}

// Custom Styles
function styles() {
	return src('app/src/' + preprocessor + '/main.*')
	.pipe(eval(preprocessor)())
	.pipe(concat('app.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(dest('app/dist/assets/css'))
	.pipe(browserSync.stream())
}

// Scripts & JS Libraries
function scripts() {
	return src([
		// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
		'app/src/js/app.js' // app.js. Always at the end
		])
	.pipe(concat('app.min.js'))
	.pipe(uglify()) // Minify JS (opt.)
	.pipe(dest('app/dist/assets/js'))
	.pipe(browserSync.stream())
}

// Images
function images() {
	return src('app/src/images/**/*')
	.pipe(newer('app/dist/assets/img'))
	//.pipe(imagemin())
	.pipe(imagemin([
		imagemin.mozjpeg({quality: 95, progressive: true}),
		imagemin.optipng({optimizationLevel: 10})
	]))
	.pipe(dest('app/dist/assets/img'))
}

function cleanimg() {
	return del('app/dist/assets/img/**/*', { force: true })
}

// HTML
function htmls() {
	return src('app/src/app.html')
	.pipe(concat('index.html'))
	.pipe(dest('app/dist'))
	.pipe(browserSync.stream())
}

// Fonts
function fonts() {
	return src('app/src/fonts/*.woff2')
	//.pipe(concat('index.html'))
	.pipe(dest('app/dist/assets/fonts'))
	//.pipe(browserSync.stream())
}

// Deploy
function deploy() {
	return src('app/dist/')
	.pipe(rsync({
		root: 'app/dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], ['*.conf'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

// Watching
function startwatch() {
	watch('app/src/*.html', parallel('htmls'));
	watch('app/src/fonts/*.woff2', parallel('fonts'));
	watch('app/src/' + preprocessor + '/*', parallel('styles'));
	watch(['app/src/**/*.js', '!app/dist/assets/js/*.min.js'], parallel('scripts'));
	watch(['app/src/**/*.{' + imageswatch + '}'], parallel('images'));
	watch(['app/src/**/*.{' + fileswatch + '}']).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.assets      = series(fonts, cleanimg, styles, scripts, images);
exports.htmls		= htmls;
exports.fonts		= fonts;
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(htmls, images, styles, scripts, browsersync, startwatch);

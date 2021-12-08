const {src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixes = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-image')
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify')
const soursemaps = require('gulp-sourcemaps')
const del = require('del')

const browserSync = require('browser-sync').create()

const clean = () => {
    return del('dist')
}
const clean2 = () => {
  return del('build')
}

const resources = () => {
    return src('src/resources/**')
    .pipe(dest('dist'))
}
const resources2 = () => {
  return src('src/resources/**')
  .pipe(dest('build'))
}

const stylesBuild =() => {
    return src('src/styles/**/*.css')
    .pipe(concat('main.css'))
    .pipe(autoprefixes({
        cascade:false
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}


const styles = ()=> {
    return src('src/styles/**/*.css')
    .pipe(soursemaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixes({
        cascade:false
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(soursemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
    return src('src/**/*.html')
    .pipe(htmlMin({
        collapseWhitespace:true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinify2 = () => {
  return src('src/**/*.html')
  .pipe(htmlMin({
      collapseWhitespace:true,
  }))
  .pipe(dest('build'))
  .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(dest('dist/images'))
}

const svgSprites2 = () => {
  return src('src/images/svg/**/*.svg')
  .pipe(svgSprite({
      mode: {
          stack: {
              sprite: '../sprite.svg'
          }
      }
  }))
  .pipe(dest('build/images'))
}

const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
        toplevel:true
    }).on('error', notify.onError()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())

}

const scripts2 = () => {
  return src([
      'src/js/components/**/*.js',
      'src/js/main.js'
  ])
  .pipe(babel({
      presets: ['@babel/env']
  }))
  .pipe(concat('app.js'))
  .pipe(uglify({
      toplevel:true
  }).on('error', notify.onError()))
  .pipe(dest('build'))
  .pipe(browserSync.stream())

}

const watchFiles = () =>{
    browserSync.init({
        server: {
            baseDir:'dist'
        }
    })
}

const watchFiles2 = () =>{
  browserSync.init({
      server: {
          baseDir:'build'
      }
  })
}

const images =() => {
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg',
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

const images2 =() => {
  return src([
      'src/images/**/*.jpg',
      'src/images/**/*.jpeg',
      'src/images/**/*.png',
      'src/images/*.svg',
  ])
  .pipe(image())
  .pipe(dest('build/images'))
}


watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/**/*.svg',svgSprites)
watch('src/js/**/*.js',scripts)
watch('src/resources/**',resources)


exports.styles = styles
exports.htmlMinify = htmlMinify
exports.clean = clean
exports.build = series(clean2, resources2, htmlMinify2,scripts2,stylesBuild,images2,svgSprites2,watchFiles2)
exports.default = series(clean, resources, htmlMinify,styles,images,svgSprites,watchFiles)

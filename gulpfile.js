const { src, dest, series } = require('gulp')
const terser = require('gulp-terser')
const babel = require('gulp-babel')

const paths = {
    src: 'src/*.json',
    srcJS: 'src/index.js',

    dist: 'dist/',
    distJS: 'dist/'
}

function js(cb) {
    src(paths.srcJS)
        .pipe(babel({
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-transform-runtime"
            ]
        }))
        .pipe(terser({
            keep_fnames: true,
            mangle: true
        }))
        .pipe(dest(paths.distJS))

    cb()
}

function misc(cb) {
    src(paths.src).pipe(dest(paths.dist))

    cb()
}

exports.build = series(js, misc)
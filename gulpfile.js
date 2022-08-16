
const { src, dest, watch, series, parallel } = require('gulp');

// Dependencias de CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Dependencias de Imagenes

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done ) {
    // Compilar SASS
    // pasos: 1- Identificar archivo, 2- Compilarla, 3 - Guardar el .css

    src('src/scss/app.scss') // Paso 1
        .pipe( sourcemaps.init() ) // Para los sourcemaps
        .pipe( sass( ) ) // Paso 2
            .pipe( postcss( [autoprefixer(), cssnano() ] ) )
            .pipe( sourcemaps.write('.'))
            .pipe( dest('build/css') ) // Paso 3

            done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
            .pipe( dest('build/img') )

    
}

function versionWebp() {
    const opciones = {
        quality: 50
    }

    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
            .pipe( dest('build/img') )
}

function versionAvif() {
    const opciones = {
        quality: 50
    }

    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
            .pipe( dest('build/img') )
}

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

// Series - Se inicia una tarea y hasta que finaliza inicia la siguiente.
//Parallel -  Todas inician al mismo tiempo.

// Tip dejar de ultima funcion la que contiene el watch.
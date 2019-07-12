[![NPM version](https://img.shields.io/badge/npm-1.0.3-blue.svg)](https://www.npmjs.com/package/@bemtools/gulp-bundle-scss)
[![Build Status](https://travis-ci.org/yury-kopyl/bemtools__gulp-bundle-scss.svg?branch=master)](https://travis-ci.org/yury-kopyl/bemtools__gulp-bundle-scss)

Create bundle SCSS file with import blocks

## Installation

> npm install @bemtools/gulp-bundle-scss @bemtools/gulp-extract-html-class --save

## Sample gulpfile.js

This file will give you a taste of what plugin does.

```javascript
const gulp         = require('gulp');
const extractClass = require('@bemtools/gulp-extract-html-class');
const bundleSCSS = require('@bemtools/gulp-bundle-scss');

gulp.task('bundle:scss', () => {
	gulp.src('./src/html/**/*.html')
		.pipe(extractClass())
		.pipe(bundleSCSS())
		.pipe(gulp.dest('./src/bundles'))
});
```

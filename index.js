const ERRORS = require('./errors');
const through = require('through2');
const fs = require('fs');

/**
 *
 * @returns {through} through object and the custom key "classList", which contains an array with a list of classes and SCSS bundle file
 */
module.exports = params => through.obj(function (file, enc, cb) {
	let options = Object.assign({
		blocksPath: './src/blocks',
		includesPath: '../blocks',
		jsSuffix: '-js',
		classList: undefined
	}, params);

	if (file.isStream()) {
		this.emit('error', new Error(ERRORS.isStream));
		cb();
		return;
	}

	if (file.path.slice(-5) !== '.html') {
		this.emit('error', new Error(ERRORS.isNotHTML));
		cb();
		return;
	}

	if (!file.contents.length) {
		this.emit('error', new Error(ERRORS.isEmptyFile));
		cb();
		return;
	}

	try {
		let jsClassList = [];
		let fileContent = '';
		let classes = options.classList ? options.classList : file.classList;

		classes.forEach((item, index) => {
			if ( item.slice(-3) === options.jsSuffix ) {
				let parsedClassName = item.slice(0, -3);
				let parsedString = parsedClassName.split('_');
				let filePath = parsedString.length === 1 ? `${process.cwd()}/${options.blocksPath}/${parsedClassName}/${parsedClassName}.json` : `${process.cwd()}/${options.blocksPath}/${parsedString[0]}/${parsedClassName}.json`;

				try {
					let includeClassFromJS = require(filePath);

					for( let key in includeClassFromJS ) {
						if ( includeClassFromJS.hasOwnProperty(key) ) {
							if ( includeClassFromJS[key] === item ) {
								classes[index] = parsedClassName;
							} else {
								jsClassList.push(includeClassFromJS[key]);
							}
						}
					}
				} catch (e) {
					console.warn(`${ERRORS.fileNotExist}${filePath}`);
				}
			}
		});

		classes = classes.concat(jsClassList).sort();

		classes.map(item => {
			let parsedString = item.split('_');
			let fileName = parsedString.length === 1 ? `${item}/${item}` : `${parsedString[0]}/${item}`;

			if ( fs.existsSync(`${options.blocksPath}/${fileName}.scss`) ) {
				fileContent += `@import "${options.includesPath}/${fileName}";\n`;
			} else {
				fileContent += `//\t\t⚠ File does not exist ⚠\n// @import "${options.includesPath}/${fileName}.scss";\n`;
				console.warn(`${ERRORS.fileNotExist}${options.includesPath}/${fileName}.scss`);
			}
		});

		file.contents = new Buffer(fileContent);
		file.path = file.path.slice(0, -4);
		file.path += 'scss';
		file.classList = classes;
	} catch (err) {
		this.emit('error', new Error(`${ERRORS.SWWrong}${err}`));
		cb();
		return;
	}

	this.push(file);
	cb();
});

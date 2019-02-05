const fs = require('fs');
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const argv = require('yargs').argv;
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const path = require('path');
const process = require('process');
const filterBy = require('gulp-filter-by');
const transform = require('gulp-transform');
const rename = require('gulp-rename');
const diff = require('gulp-diff');
const chalk = require('chalk');
const log = require('fancy-log');
const jsonConcat = require('gulp-json-concat');
require('babel-core/register');
require('babel-polyfill');

let tf;
const config = require('./api_config.json');

function handleError(err) {
	console.log(err.toString());
	process.exit(1);
}

function setConfig() {
	//CLI args overwrite JSON config

	if (argv.api_path) config.api_path = argv.api_path;
	if (argv.local) config.api_path = 'http://localhost:8888/_ah/api';
	if (argv.slocal) config.api_path = 'https://localhost:8888/_ah/api';
	console.log('Configured server adress: ' + config.api_path);

	if (argv.app_path) config.app_path = argv.app_path;
	else {
		// if api_path is explicitly passed, use this
		if (!config.app_path)
			config.app_path = config.api_path.substring(
				0,
				config.api_path.length - 8
			); // just strip the /_ah/api
	}
	console.log('Configured app adress: ' + config.app_path);

	if (argv.local || argv.slocal) config.sync_service = 'http://localhost:8080';
	console.log('Configured rts server adress: ' + config.sync_service);

	if (argv.api_version) config.api_version = argv.api_version;
	if (argv.client_id) config.client_id = argv.client_id;
	if (argv.facebook_client_id)
		config.facebook_client_id = argv.facebook_client_id;
	if (argv.twitter_client_id) config.twitter_client_id = argv.twitter_client_id;
	if (argv.local) config.test_mode = true;
	else config.test_mode = false;
	
	// Set workbox log level default to debug
	if (!config.workbox_log_level) config.workbox_log_level = 'workbox.core.LOG_LEVELS.debug';
}

gulp.task('bundle-ci', ['set-node-env-production', 'bundle-task']);

gulp.task('bundle', ['format', 'bundle-task', 'set-config']);

gulp.task('set-node-env-production', () => {
	process.env.NODE_ENV = 'production';
});

gulp.task('format', () => {
	return gulp
		.src([
			'**/*.jsx',
			'**/*.js',
			'!dist/**',
			'!WEB-INF/**',
			'!node_modules/**',
			'!components/**',
			'!tests/**'
		])
		.pipe(prettierEslint())
		.pipe(gulp.dest('./'));
});

gulp.task('generate-language-files', () => {
	const templateFile = tf.TranslationFile.fromContent(
		fs.readFileSync('translations/template.txt', 'utf8')
	);
	const template = templateFile.getMessageIdents();

	return (
		gulp
			.src('translations/*.txt')
			.pipe(
				transform('utf8', (content, file) => {
					const translationFile = tf.TranslationFile.fromContent(content);
					const identList = translationFile.getMessageIdents();
					const messages = {};
					let fail = false;
					identList.forEach(ident => {
						if (messages[ident.id]) {
							log(chalk.yellow(`Duplicate ident ${chalk.bold(ident.id)}`));
							fail = true;
							return;
						}
						messages[ident.id] = ident.defaultMessage;
					});
					const result = JSON.stringify(messages, null, '\t');
					template.forEach(ident => {
						if (!messages.hasOwnProperty(ident.id)) {
							log(
								chalk.yellow(
									`Ident ${chalk.bold(ident.id)} is missing in translation`
								)
							);
							fail = true;
							return;
						}
						delete messages[ident.id];
					});
					fail |= Object.keys(messages).length > 0;
					if (fail) {
						for (const id of Object.keys(messages)) {
							log(
								chalk.yellow(
									`Ident ${chalk.bold(id)} does not exist in template`
								)
							);
						}
						log.error(
							chalk.red.bold(
								`Translation file ${file.relative} does not match template`
							)
						);
						// If argument verifyTranslation is passed, then the task will fail
						if (argv.verifyTranslation)
							return Promise.reject('Translation file invalid.');
					}
					return result;
				})
			)
			.on('error', error => {
				log.error(chalk.red.bold(error));
				process.exit(1);
			})
			.pipe(rename({ extname: '.json' }))
			.pipe(gulp.dest('dist/messages/'))
			.pipe(gulp.dest('../target/unieins-v1/dist/messages/'))
			// check if messages -> template -> messages is stable
			.pipe(
				filterBy(file => {
					return file.relative.match(/template.json$/);
				})
			)
			.pipe(rename({ basename: 'en' }))
			.pipe(diff('dist/messages/'))
			.pipe(diff.reporter({ fail: true }))
			.on('error', error => {
				log.error(
					chalk.red.bold(
						'Template cannot reassemble extracted messages.\n' +
							'If you did not modify the template than its a bug'
					)
				);
				process.exit(1);
			})
	);
});

gulp.task(
	'update-translations',
	/*['bundle-task'],*/ () => {
		const templateFile = tf.TranslationFile.fromContent(
			fs.readFileSync('translations/template.txt', 'utf8')
		);
		const template = templateFile.getMessageIdents();
		return gulp
			.src('translations/*.txt')
			.pipe(filterBy(file => !file.relative.match(/template.txt$/)))
			.pipe(
				transform('utf8', (content, file) => {
					const translationFile = tf.TranslationFile.fromContent(content);
					const identList = translationFile.getMessageIdents();
					const messages = {};
					identList.forEach(ident => {
						if (messages[ident.id]) {
							log(chalk.yellow(`Duplicate ident ${chalk.bold(ident.id)}`));
							throw new Error('Cannot update invalid translation file');
						}
						messages[ident.id] = ident;
					});
					let first = true;
					template.forEach(ident => {
						if (!messages.hasOwnProperty(ident.id)) {
							const clone = { ident };
							if (first)
								clone.description = `
---------------------------------------------
These strings are missing in this translation
---------------------------------------------

add:

${clone.description || ''}`;
							clone.id = `# ${clone.id}`;
							clone.defaultMessage = clone.defaultMessage.replace(/\n/g, '\n#');
							identList.push(clone);
							first = false;
						}
						delete messages[ident.id];
					});
					if (Object.keys(messages).length > 0) {
						for (const id of Object.keys(messages)) {
							const obj = messages[id];
							obj.description = `del: ${obj.description || ''}`;
							obj.id = `# ${obj.id}`;
							obj.defaultMessage = obj.defaultMessage.replace(/\n/g, '\n#');
						}
					}
					return tf.TranslationFile.fromMessageIdentList(identList).source();
				})
			)
			.on('error', error => {
				log.error(chalk.red.bold(error));
				process.exit(1);
			})
			.pipe(gulp.dest('translations'))
			.pipe(gulp.dest('../target/unieins-v1/translations'));
	}
);

gulp.task('translation-watch', () => {
	const watcher = gulp.watch('translations/*.txt', ['generate-language-files']);
	return watcher;
});

gulp.task('bundle-task', function() {
	setConfig();
	return (
		gulp
			.src('') //doesn't matter what to put as src,
			//since webpack.config fetches from entry points
			.pipe(webpackStream(require('./webpack.config.js'), webpack))
			.on('error', handleError)
			.pipe(gulp.dest('dist/js/'))
			.pipe(gulp.dest('../target/unieins-v1/dist/js/'))
	);
});

gulp.task('set-config', ['set-config-dist', 'set-config-target']);

gulp.task('set-config-dist', function() {
	setConfig();
	return gulp
		.src('dist/js/*.js')
		.on('error', handleError)
		.pipe(replace('$APP_PATH$', config.app_path))
		.pipe(replace('$API_PATH$', config.api_path))
		.pipe(replace('$API_VERSION$', config.api_version))
		.pipe(replace('$CLIENT_ID$', config.client_id))
		.pipe(replace('$FACEBOOK_CLIENT_ID$', config.facebook_client_id))
		.pipe(replace('$TWITTER_CLIENT_ID$', config.twitter_client_id))
		.pipe(replace('$SYNC_SERVICE$', config.sync_service))
		.pipe(replace('$TEST_MODE$', config.test_mode))
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('set-config-target', function() {
	setConfig();
	return gulp
		.src('../target/unieins-v1/dist/js/*.js')
		.on('error', handleError)
		.pipe(replace('$APP_PATH$', config.app_path))
		.pipe(replace('$API_PATH$', config.api_path))
		.pipe(replace('$API_VERSION$', config.api_version))
		.pipe(replace('$CLIENT_ID$', config.client_id))
		.pipe(replace('$FACEBOOK_CLIENT_ID$', config.facebook_client_id))
		.pipe(replace('$TWITTER_CLIENT_ID$', config.twitter_client_id))
		.pipe(replace('$SYNC_SERVICE$', config.sync_service))
		.pipe(replace('$TEST_MODE$', config.test_mode))
		.pipe(gulp.dest('../target/unieins-v1/dist/js/'));
});

gulp.task('set-config-pom', function() {
	return gulp
		.src('../pom.xml')
		.on('error', handleError)
		.pipe(replace('APPENGINE_APP_VERSION', config.api_version.substring(1,config.api_version.length)))
		.pipe(replace('APPENGINE_APP_ID', config.application))
		.pipe(gulp.dest('../pom.xml'));
});

gulp.task('webpack-watch', function() {
	setConfig();
	return (
		gulp
			.src('') //doesn't matter what to put as src,
			//since webpack.config fetches from entry points
			.pipe(
				webpackStream(
					Object.assign(require('./webpack.config.js'), {
						watch: true
					}),
					webpack
				)
			)
			.on('error', handleError)
			.pipe(replace('$APP_PATH$', config.app_path))
			.pipe(replace('$API_PATH$', config.api_path))
			.pipe(replace('$API_VERSION$', config.api_version))
			.pipe(replace('$CLIENT_ID$', config.client_id))
			.pipe(replace('$FACEBOOK_CLIENT_ID$', config.facebook_client_id))
			.pipe(replace('$TWITTER_CLIENT_ID$', config.twitter_client_id))
			.pipe(replace('$SYNC_SERVICE$', config.sync_service))
			.pipe(replace('$TEST_MODE$', config.test_mode))
			.pipe(gulp.dest('dist/js/'))
			.pipe(gulp.dest('../target/unieins-v1/dist/js/'))
	);
});

gulp.task('prepare-sw-for-watch', function() {
	const swDir = 'dist/js/service-worker';
	swDir.split(path.sep).reduce((currentPath, folder) => {
		currentPath += folder + path.sep;
		if (!fs.existsSync(currentPath)) {
			fs.mkdirSync(currentPath);
		}
		return currentPath;
	}, '');
	fs.closeSync(fs.openSync(swDir + '/sw.dist.js', 'a'));
});

gulp.task('sw', function() {
	setConfig();
	gulp
		.src('dist/js/service-worker/sw.dist.js')
		.pipe(replace('$API_VERSION$', config.api_version))
		.pipe(replace('$WORKBOX_LOG_LEVEL$', config.workbox_log_level))
		.pipe(gulp.dest('../target/qdacity-war/'))
		.pipe(gulp.dest('./'));
});

gulp.task('sw-watch', ['prepare-sw-for-watch'], function() {
	gulp.watch('dist/js/service-worker/sw.dist.js', ['sw']);
});

gulp.task('watch', ['webpack-watch', 'sw-watch']);
gulp.task('watch-minified', ['set-node-env-production', 'watch']);

gulp.task('default', ['watch']);

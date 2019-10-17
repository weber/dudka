/*


const pathProgramm = path.resolve(__dirname, 'node_modules', '.bin', 'hygen')
console.log('pathProgramm', pathProgramm);
 */

const {spawn} = require('child_process');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra')
const inquirer = require('inquirer')
const colors = require("colors");
const replace = require('replace-in-file');
const npm = require('enpeem');

module.exports = {
	prompt: ({ prompter, args }) => {
		return new Promise((resolve, reject) => {
			inquirer
				.prompt([
					{
						type: 'input',
						name: 'name',
						default: 'myApp',
						message: "Введите название проекта(англ.)?"
					},
					{
						type: 'input',
						name: 'title',
						default: 'Мое новое SPA',
						message: "Введите имя приложения(рус.)?"
					},
					{
						type: 'input',
						name: 'iteration',
						default: '11.6.0',
						message: "Введите номер итерации?"
					},
					{
						type: 'input',
						name: 'repo',
						default: 'git+ssh://cl-tfs2018:22/tfs/CK-11/WebDev/_git/YOUR_NAME_PROJECT',
						message: "Введите адерс репозитория?"
					},
					{
						type: 'input',
						name: 'author',
						default: 'Фамилия Имя <YOUR_MAIL@monitel.com>',
						message: "Введите Ф.И. и email автора"
					}
				])
				.then(({ name, title, iteration, repo, author }) => {
					return {name, title, iteration, repo, author}
				})
				.then(r => {
				
					return new Promise(res => {
						const sp = spawn('ng', ['new', r.name, '--routing=true', '--skipInstall=false', '--style=scss', '--prefix=c'], {
							stdio: ['inherit', 'inherit', 'inherit'],
							shell: true
						})
						
						
						
						sp.on('close', _ => {
						//	spinner.stop()
							console.log("[", "базовое приложение создано".white,   "]");
							return res(r)
						})
						
					})
				})
				.then(r => {
					 const spinner = ora('Инициализация базового приложения').start();
						spinner.color = 'yellow';
					return new Promise(res => {
						const pathTo =  path.resolve(process.cwd(), r.name)
						
						npm.install({
							dir: pathTo,
							dependencies: [
								'@angular/cdk',
								'@compodoc/compodoc',
								'@angular/router',
								'@ngrx/effects ',
								'@ngrx/store',
								'date-fns',
								'devextreme',
								'devextreme-angular',
								'devextreme-intl',
								'downloadjs ',
								'hammerjs',
								'module-alias',
								'monitel-web-styles@git+ssh://cl-tfs2018.monitel.local:22/tfs/CK-11/WebDev/_git/WebStyles',
								'npm-check-updates',
								'ramda',
								'ngx-toastit',
								'ramda-extension',
								'reflect-metadata',
								'sails-disk@git://github.com/balderdashy/sails-disk.git#associations',
								'lodash'
							],
							devDependencies: [
								'@fortawesome/fontawesome-free',
								'@ngrx/schematics',
								'@ngrx/store-devtools',
								'@typed-f/either',
								'@typed-f/lens',
								'@typed-f/maybe',
								'@typed-f/function',
								'angular2-fontawesome',
								'husky'
							],
							loglevel: 'silent',
							'cache-min': 999999999
						}, function (err) {
							spinner.stop()
							return res(r)
						});
					})
					
				})
				
				.then(r => {
					const pathTo =  path.resolve(process.cwd(), r.name)
					const pathFrom = path.resolve(__dirname, './files/')
					const pathCopyFrom = path.resolve(__dirname, '../../../', 'files/')
 
					console.log('pathCopyFrom',pathCopyFrom)
					
					fs.copy(pathCopyFrom, pathTo)
						.then(() => console.log('success!'))
						.catch(err => console.error(err))
					
					
					console.log(r.name.green, r.title.red, r.iteration.yellow)
					
					r.pathTo = pathTo

					return r
				})
				
				.then(r => {
					const pathToPackageJson = path.resolve(process.cwd(), r.name, 'package.json')
					const pathNG = `./node_modules/.bin/ng`
					const pathTSLint = `./node_modules/.bin/tslint`
					const pathCompodoc = `./node_modules/@compodoc/compodoc/bin/index-cli.js`
					
					setOptionPackage (pathToPackageJson, 'name', r.name)
					setOptionPackage (pathToPackageJson, 'version', r.iteration)
					setOptionPackage (pathToPackageJson, 'ng', pathNG)
					setOptionPackage (pathToPackageJson, 'start', `${pathNG} serve --progress --aot`)
					setOptionPackage (pathToPackageJson, 'build', `node --max_old_space_size=8000 ${pathNG} build --prod --base-href /${r.name}/ --progress`)

					setOptionPackage (pathToPackageJson, 'test', `${pathNG} test`)
					setOptionPackage (pathToPackageJson, 'e2e', `${pathNG} e2e`)
					return r
				})
				.then(r => {
					resolve(r)
				})
		})
	}
}

function setParam (name, type = 'string') {
	if (type === 'string')
	return new RegExp('((\\"' + name + '\\"\\:)([0-9A-Za-z\\"\\-\\_\\s\\.\\/\\=])*)', 'i')
}

function setValue (name, value) {
	return '"' + name + '": ' + '"' + value + '"'
}

function setOptionPackage (pathTo, paramName, paramValue) {

	const results = replace.sync({
		files: pathTo,
		from: setParam(paramName),
		to: setValue(paramName, paramValue),
	});
	return results
}

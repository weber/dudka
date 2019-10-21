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
const gitconfig = require('gitconfig')



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
						default: 'YOUR_NAME_PROJECT',
						message: "Введите имя репозитория?"
					}
				])
				.then(({ name, title, iteration, repo }) => {
					
					return {name, title, iteration, repo}
				})
				.then(r => {
					const pathTo =  path.resolve(process.cwd(), r.name)
					r.pathTo = pathTo
					return r
				})
				.then(r => {
					return new Promise(res => {
						gitconfig.get({
							location: 'global'
						}).then((config) => {
							r.author = `${config.name} <${config.emai}>`
							r.userName = config.name
							r.userEmail = config.email
							return res(r)
						})
					})
				})
				.then(r => {
					fs.ensureDirSync(r.pathTo)
					return r
				})
				.then(r => {
					// git checkout -b
					return new Promise(res => {
						console.log("[", "Инициализация GIT".white,   "]");
						const sp = spawn('git', ['init'
						], {
							stdio: ['inherit', 'inherit', 'inherit'],
							shell: true,
							cwd: r.pathTo
						})
						
						sp.on('close', _ => {
							console.log("[", "Инициализация GIT - закончена".white,   "]");
							return res(r)
						})
						
					})
				})
				/*.then(r => {
					
					if (r.repo && r.repo !== 'YOUR_NAME_PROJECT') {
						return new Promise(res => {
							console.log("[", "Привязка к репозиторию проекта".white,   "]");
								const sp = spawn('git', ['remote', 'add', 'origin', `ssh://cl-tfs2018:8080/tfs/CK-11/WebDev/_git/${r.repo}`
							
							], {
								stdio: ['inherit', 'inherit', 'inherit'],
								shell: true,
								cwd: r.pathTo
							})
							
							sp.on('close', _ => {
								console.log('error', _)
								console.log("[", "Привязка к репозиторию проекта закончена".white,   "]");
								return res(r)
							})
							
						})
					} else {
						return r
					}
					
				})
				.then(r => {
					if (r.repo && r.repo !== 'YOUR_NAME_PROJECT') {
						return new Promise(res => {
							console.log("[", "Фиксируем в репозитории".white,   "]");
							const sp = spawn('git', ['push', '-u', 'origin', '--all'
							], {
								stdio: ['inherit', 'inherit', 'inherit'],
								shell: true,
								cwd: r.pathTo
							})
							
							sp.on('close', _ => {
								console.log("[", "Фиксация в репозитории закончена".white,   "]");
								return res(r)
							})
							
						})
					} else {
						return r
					}
				})*/
				/*.then(r => {
					if (r.repo && r.repo !== 'YOUR_NAME_PROJECT') {
						return new Promise(res => {
							console.log("[", "Создаем ветку".white,   "]");
							const sp = spawn('git', ['pull'
							], {
								stdio: ['inherit', 'inherit', 'inherit'],
								shell: true,
								cwd: r.pathTo
							})
							
							sp.on('close', _ => {
								console.log("[", "Ветка создана".white,   "]");
								return res(r)
							})
							
						})
					} else {
						return r
					}
					
				})*/
				/*.then(r => {
					// git checkout -b
					return new Promise(res => {
						console.log("[", `Создаем ветку master`.blue,   "]");
						const sp = spawn('git', ['checkout', '-b', 'master'
						], {
							stdio: ['inherit', 'inherit', 'inherit'],
							shell: true,
							cwd: r.pathTo
						})
						
						sp.on('close', _ => {
							console.log("[", "Ветка master создана".white,   "]");
							return res(r)
						})
						
					})
				})*/
				.then(r => {
						// git checkout -b
						return new Promise(res => {
							console.log("[", `Создаем ветку ${r.iteration}`.blue,   "]");
							const sp = spawn('git', ['checkout', '-b', r.iteration
							], {
								stdio: ['inherit', 'inherit', 'inherit'],
								shell: true,
								cwd: r.pathTo
							})
							
							sp.on('close', _ => {
								console.log("[", "Ветка создана".white,   "]");
								return res(r)
							})
							
						})
				})
				
				.then(r => {
				  /*const spinner = ora(`Инициализация приложения ${r.name}`).start();
					spinner.color = 'yellow';*/
					return new Promise(res => {
						console.log("[", "Установка базового приложения ".white,   "]");
						const sp = spawn('ng', ['new', r.name, '--commit=false',  '--routing=true', '--skipInstall=false', '--style=scss', '--prefix=c'], {
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
					
					const pathFrom = path.resolve(__dirname, './files/')
					const pathCopyFrom = path.resolve(__dirname, '../../../', 'files/')
					
					fs.copy(pathCopyFrom, r.pathTo)
						.then(() => console.log('success!'))
						.catch(err => console.error(err))
					
					
					console.log(r.name.green, r.title.red, r.iteration.yellow)
					
					

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
					
					return new Promise(res => {
						console.log("[", "Установка зависимостей приложения начата".white,   "]");
						const sp = spawn('npm', ['i',
							'@compodoc/compodoc',
							'@angular/cdk',
							'@ngrx/effects',
							'@ngrx/store',
							'date-fns',
							'devextreme',
							'devextreme-angular',
							'devextreme-intl',
							'downloadjs',
							'hammerjs',
							'module-alias',
							'npm-check-updates',
							'ramda',
							'ramda-extension',
							'reflect-metadata'
						], {
							stdio: ['inherit', 'inherit', 'inherit'],
							shell: true,
							cwd: r.pathTo
						})
						
						
						
						sp.on('close', _ => {
							//	spinner.stop()
							console.log("[", "Установка зависимостей приложения закончена".white,   "]");
							return res(r)
						})
						
					})
				})
				.then(r => {
					
					return new Promise(res => {
						console.log("[", "Установка зависимостей разработки начата".white,   "]");
						const sp = spawn('npm', ['i',
							'@fortawesome/fontawesome-free',
							'@ngrx/schematics',
							'@ngrx/store-devtools',
							'@typed-f/either',
							'@typed-f/function',
							'@typed-f/lens',
							'@typed-f/maybe',
							'angular2-fontawesome',
							'husky',
							'ngx-toastit',
							'on-push-tslint',
							'monitel-web-styles@git+ssh://cl-tfs2018.monitel.local:22/tfs/CK-11/WebDev/_git/WebStyles'
						], {
							stdio: ['inherit', 'inherit', 'inherit'],
							shell: true,
							cwd: r.pathTo
						})
						
						sp.on('close', _ => {
							
							console.log("[", "Установка зависимостей разработки закончена".white,   "]");
							return res(r)
						})
						
					})
				})
				
				
				.then(r => {
					/*spinner.stop()*/
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

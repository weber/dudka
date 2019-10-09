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
					}
				])
				.then(({ name, title, iteration }) => {
				
					return new Promise(res => {
						const sp = spawn('ng', ['new', name, '--skipInstall=true', '--style=scss', '--prefix=c'], {
							stdio: ['inherit', 'inherit', 'inherit'],
						})
						
						/* const spinner = ora('Инициализация базового приложения').start(); 
						spinner.color = 'yellow'; */
						
						sp.on('close', _ => {
						//	spinner.stop()
							console.log("[", "базовое приложение создано".white,   "]");
							return res({ name, title, iteration }) 
						})
						
					})
				})
				
				.then(r => {
					const pathTo =  path.resolve(process.cwd(), r.name)
					const pathFrom = path.resolve(__dirname, './files/')
 
					
					fs.copy(pathFrom, pathTo)
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
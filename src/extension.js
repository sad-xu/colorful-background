// import * as vscode from 'vscode'
const vscode = require('vscode')
const colorfulBackground = require('./colorfulBackground.js')
// import * as colorfulBackground from './colorfulBackground.js'

function activate(context) {
	console.log('active')
	vscode.window.showInformationMessage('active')
	context.subscriptions.push(vscode.commands.registerCommand('extension.installColorfulBackground', () => {
		colorfulBackground.init()
		vscode.window.showInformationMessage('installColorfulBackground')
	}))
	context.subscriptions.push(vscode.commands.registerCommand('extension.uninstallColorfulBackground', () => {
		colorfulBackground.uninstall()
		vscode.window.showInformationMessage('uninstallColorfulBackground')
	}))
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}

const vscode = require('vscode')
const colorfulBackground = require('./colorfulBackground.js')

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.installColorfulBackground', () => {
		colorfulBackground.init()
		vscode.window.showInformationMessage('install colorful background')
	}))
	context.subscriptions.push(vscode.commands.registerCommand('extension.resetColorfulBackground', () => {
		colorfulBackground.reset()
		vscode.window.showInformationMessage('reset colorful background')
	}))
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}

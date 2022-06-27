// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { bradWebView } from './extensions/webview';
import { showStatusBar } from './extensions/statusbar';
import {BradTextEditorProvider}  from './extensions/texteditor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "brad language" is now active!');

	// webview
	bradWebView(context);

	// show status bar
	showStatusBar(context);

	// text editor
	context.subscriptions.push(BradTextEditorProvider.register(context));
}


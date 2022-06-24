import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function showStatusBar(context: vscode.ExtensionContext) {
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'test.showSelectionCount';
	context.subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`haha, ${n} line(s) selected... Keep going!`);
	}));
	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);
	// register some listener that make sure the status bar 
	// item always up-to-date
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n > 0) {
		myStatusBarItem.text = `$(megaphone) ${n} lines selected`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}
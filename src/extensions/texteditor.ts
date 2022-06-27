import * as vscode from 'vscode';

export class BradTextEditorProvider implements vscode.CustomTextEditorProvider {

    constructor(private context: vscode.ExtensionContext) { }

    private static readonly viewType = 'editorCustom.brad';

    public static register(context: vscode.ExtensionContext) {
        return vscode.window.registerCustomEditorProvider(
            BradTextEditorProvider.viewType,
            new BradTextEditorProvider(context)
        );
    }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        console.log('resolveCustomTextEditor invoked');

        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebview(document);

        function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

        // Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case 'add':
					this.addSomething(document);
					return;

				case 'delete':
					this.deleteSomething(document, e.id);
					return;
			}
		});

        updateWebview();
    }

    private getHtmlForWebview(document: vscode.TextDocument): string {
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Brad Language</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                }
             </style>
        </head>
        <body>
        <div id="editor">
            ${document.getText()}
        </div>
            <div id="button">
                <button>brad</button>
          </div>
            </body>
        </html>`;
        return html;
    }

    private addSomething(document: vscode.TextDocument) {
        return this.updateTextDocument(document, document);
    }

    private deleteSomething(document: vscode.TextDocument, id: string) {
    }

    	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, newDocument: any) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			newDocument.getText());

		return vscode.workspace.applyEdit(edit);
	}
}
import * as vscode from "vscode";
import * as path from 'path';

export function bradWebView(context: vscode.ExtensionContext) {
    const command:string = "test.webView";
    const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
        "bradWebView",
        "Brad Web View",
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    context.subscriptions.push(vscode.commands.registerCommand(command, () => {
        panel.webview.html = getHtmlForWebview(panel, context);
    }));
}

function getHtmlForWebview(panel:vscode.WebviewPanel, context:vscode.ExtensionContext): string {
    const styleWebViewPath = vscode.Uri.file(
        path.join(context.extensionPath, 'static/webview/webview.css')
      );
    const styleWebViewUri: vscode.Uri = panel.webview.asWebviewUri(styleWebViewPath);

    const jsWebViewPath = vscode.Uri.file(
        path.join(context.extensionPath, 'static/webview/webview.js')
      );
    const jsWebViewUri: vscode.Uri = panel.webview.asWebviewUri(jsWebViewPath);
    return `
        <html>
            <head>
            <link rel="stylesheet" href="${styleWebViewUri}", rel=
            stylesheet">
            </head>
            <body>
                <h1 id="MyTitle">Brad Web View</h1>
                <br>
                <button class="ChangeColor" onclick="changeColor()">Change Color</button>
            </body>
            <script src="${jsWebViewUri}"></script>
            </html>
            `;
}
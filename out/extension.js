'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const axios_1 = require("axios");
function activate(context) {
    console.log('Galois-autocompleter-plugin is now active!');
    let provider = vscode.languages.registerCompletionItemProvider({ language: 'python' }, {
        provideCompletionItems(document, position, token, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const MAX_LINES_SUPPORTED = 30;
                const lineIndex = position.line;
                const textArray = document.getText().split('\n');
                const textBeforeLineArray = textArray.slice(Math.max(0, lineIndex - MAX_LINES_SUPPORTED), lineIndex);
                const textBeforeLineString = textBeforeLineArray.join('\n');
                const textLine = document.lineAt(lineIndex).text;
                const textLineBeforeCursor = document.lineAt(lineIndex).text.substr(0, position.character);
                const textBeforeCursor = textBeforeLineString + '\n' + textLineBeforeCursor;
                const currentLineReplaceRange = new vscode.Range(new vscode.Position(lineIndex, textLineBeforeCursor.length), new vscode.Position(lineIndex, textLine.length));
                const apiUrl = vscode.workspace.getConfiguration('galois-autocompleter-plugin').get('apiUrl');
                try {
                    const { data } = yield axios_1.default.post(apiUrl, {
                        "text": textBeforeCursor
                    });
                    const items = data.result.map((suggestion) => {
                        const item = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Text);
                        item.additionalTextEdits = [vscode.TextEdit.delete(currentLineReplaceRange)];
                        item.insertText = suggestion;
                        item.detail = "Galois Autocompleter";
                        item.documentation = suggestion;
                        return item;
                    });
                    return items;
                }
                catch (err) {
                    console.error(err);
                    vscode.window.showInformationMessage('Galois Autocompleter - ' + err + ' - Something went wrong while connecting to service: '
                        + apiUrl);
                }
                return [];
            });
        }
    });
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
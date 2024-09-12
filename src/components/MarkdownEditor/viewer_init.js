import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import {Editor} from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import Prism from 'prismjs';
import 'prismjs/components/prism-clojure.js';
import { customHTMLRenderer } from './html_renderers';

export default function initializeViewer(elementId) {
    const generatedId = elementId || 'markdown-viewer-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

    let viewerElement = document.querySelector(`#${generatedId}`);

    if (!viewerElement) {
        viewerElement = document.createElement('div');
        viewerElement.id = generatedId;
        document.body.appendChild(viewerElement);
    }

    return Editor.factory({
        el: viewerElement,
        viewer: true,
        height: '500px',
        customHTMLRenderer: customHTMLRenderer,
        plugins: [
            [codeSyntaxHighlight, {highlighter: Prism}],
            colorSyntax
        ]
    });
}

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
import {HtmlGenerator, parse} from 'latex.js';

export default function initializeViewer(elementId = null, markdownContent = '') {
    const generatedId = elementId || 'markdown-viewer-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

    let viewerElement = document.querySelector(`#${generatedId}`);

    if (!viewerElement) {
        viewerElement = document.createElement('div');
        viewerElement.id = generatedId;
        document.body.appendChild(viewerElement);
    }

    return Editor.factory({
        el: viewerElement,
        viewer: true, // This sets the mode to viewer
        height: '500px',
        initialValue: markdownContent, // Display the initial markdown content
        customHTMLRenderer: {
            latex(node) {
                const generator = new HtmlGenerator({hyphenate: false});
                const {body} = parse(node.literal, {generator: generator}).htmlDocument();

                let tempElement = document.createElement('div');
                tempElement.innerHTML = body.innerHTML;
                tempElement.querySelectorAll('.katex-html').forEach(element => {
                    element.remove();
                });

                return [
                    {type: 'openTag', tagName: 'div', outerNewLine: true},
                    {type: 'html', content: tempElement.innerHTML},
                    {type: 'closeTag', tagName: 'div', outerNewLine: true}
                ];
            },
            img(node) {
                const regex = /\[(.*?)]\((.*?)\)/;
                const match = node.literal.match(regex);

                const lines = node.literal
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                const imgAttributes = {};
                let style = "";
                lines.forEach(line => {
                    if (!regex.test(line)) {
                        const [key, value] = line.split(':').map(item => item.trim());
                        if (key && value) {
                            if (key === "width" || key === "height") {
                                imgAttributes[key] = value;
                            } else {
                                style += `${key}:${value};`;
                            }
                        }
                    }
                });

                if (!match) {
                    return [
                        {type: 'openTag', tagName: 'div', outerNewLine: true},
                        {type: 'closeTag', tagName: 'div', outerNewLine: true}
                    ];
                }

                imgAttributes['alt'] = match[1];
                imgAttributes['src'] = match[2];
                if (style) {
                    imgAttributes['style'] = style;
                }

                return [
                    {type: 'openTag', tagName: 'div', outerNewLine: true},
                    {
                        type: 'openTag',
                        tagName: 'img',
                        outerNewLine: false,
                        attributes: imgAttributes,
                        selfClosing: true
                    },
                    {type: 'closeTag', tagName: 'div', outerNewLine: true}
                ];
            }
        },
        plugins: [
            [codeSyntaxHighlight, {highlighter: Prism}],
            colorSyntax
        ]
    });
}

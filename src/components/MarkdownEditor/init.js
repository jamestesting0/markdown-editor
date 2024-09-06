import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/editor';
import {parse, HtmlGenerator} from 'latex.js';
import imgSrc from './latex.png'

export default function initializeEditor(elementId = null, content = '') {
    // generate and create the editor element
    const generatedId = elementId || 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

    let editorElement = document.querySelector(`#${generatedId}`);

    if (!editorElement) {
        editorElement = document.createElement('div');
        editorElement.id = generatedId;
        document.body.appendChild(editorElement);
    }

    // create the Latex toolbar button
    const latexIcon = document.createElement('img');
    latexIcon.src = imgSrc;
    latexIcon.style.width = '24px;';
    latexIcon.style.height = '24px';
    latexIcon.style.marginTop = '2px';
    latexIcon.style.filter = 'invert(34%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(53%) contrast(94%)';

    const latexButton = document.createElement('button');
    latexButton.style.cursor = 'pointer';
    latexButton.style.background = 'none';
    latexButton.style.alignSelf = 'center';
    latexButton.style.setProperty('margin', '0px', 'important');
    latexButton.appendChild(latexIcon);
    latexButton.addEventListener('click', () => {
        const selectionPos = editor.getSelection()[0];
        editor.insertText(
            '$$latex\n' +
            '\\documentclass{article}\n' +
            '\\begin{document}\n\n' +
            '$\n\n$\n\n' +
            '\\end{document}\n' +
            '$$'
        );
        selectionPos[0] = selectionPos[0] + 5
        selectionPos[1] = selectionPos[1]
        editor.setSelection(selectionPos)
    });

    const latexTool = {
        name: 'Insert Latex',
        tooltip: 'Insert Latex',
        el: latexButton,
    }

    // create the custom editor
    const editor = new Editor({
        el: editorElement,
        previewStyle: 'vertical',
        height: '500px',
        initialValue: content,
        toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'image', 'link'],
            ['code', 'codeblock', latexTool],
            ['scrollSync'],
        ],
        customHTMLRenderer: {
            latex(node) {
                const generator = new HtmlGenerator({ hyphenate: false });
                const { body } = parse(node.literal, { generator: generator }).htmlDocument();

                // remove the katex-html part as it looks ugly and is unnecessary
                let tempElement = document.createElement('div');
                tempElement.innerHTML = body.innerHTML;
                tempElement.querySelectorAll('.katex-html').forEach(element => {
                    element.remove();
                });

                return [
                    { type: 'openTag', tagName: 'div', outerNewLine: true },
                    { type: 'html', content: tempElement.innerHTML },
                    { type: 'closeTag', tagName: 'div', outerNewLine: true }
                ];
            },
        }
    });

    return editor;
}

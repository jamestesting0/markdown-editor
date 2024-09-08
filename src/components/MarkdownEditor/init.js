import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/editor';
import {parse, HtmlGenerator} from 'latex.js';
import imgSrc from './latex.png'
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";

export default function initializeEditor(elementId = null) {
    // Generate and create the editor element
    const generatedId = elementId || 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

    let editorElement = document.querySelector(`#${generatedId}`);

    if (!editorElement) {
        editorElement = document.createElement('div');
        editorElement.id = generatedId;
        document.body.appendChild(editorElement);
    }

    // Create the Latex toolbar button
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

    // Create the custom editor
    const editor = new Editor({
        el: editorElement,
        previewStyle: 'vertical',
        height: '500px',
        initialEditType: "markdown",
        placeholder: "Please enter your text here",
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

                // Remove the katex-html part as it looks ugly and is unnecessary
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
        },
        plugins: [fontSize],
        hooks: {
            // Instead of using base64, we use cloudinary API to host it as an URL
            async addImageBlobHook(blob, callback) {
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('upload_preset', 'ml_default');
                formData.append('api_key', '237145998445384');

                try {
                    const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
                        method: 'POST',
                        body: formData
                    });

                    const uploadResult = await response.json();

                    if (uploadResult.secure_url) {
                        const altText = document.getElementById('toastuiAltTextInput');
                        console.log(altText.textContent);
                        callback(uploadResult.secure_url, altText.textContent);
                    } else {
                        console.error('Upload failed:', uploadResult);
                    }
                } catch (error) {
                    console.error('Error uploading the image:', error);
                }
            }
        }
    });

    return editor;
}

import '@toast-ui/editor/dist/toastui-editor.css';
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import {Editor} from '@toast-ui/editor';
import latexImgSrc from '../../../assets/latex.png'
import clearImgSrc from '../../../assets/clear.png'
import fontSize from "tui-editor-plugin-font-size";
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import Prism from 'prismjs';
import 'prismjs/components/prism-clojure.js';
import { customHTMLRenderer } from './html_renderers';

export default function initializeEditor(elementId, isMobile) {
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
    latexIcon.src = latexImgSrc;
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
        let latexText = '$$latex\n' +
            '\\documentclass{article}\n' +
            '\\begin{document}\n\n' +
            '$\n\n$\n\n' +
            '\\end{document}\n' +
            '$$'
        if (selectionPos[1] !== 1) {
            latexText = "\n" + latexText;
        }
        editor.insertText(latexText);
        selectionPos[0] = selectionPos[0] + 5
        selectionPos[1] = selectionPos[1]
        editor.setSelection(selectionPos)
    });

    const latexTool = {
        name: 'Insert Latex',
        tooltip: 'Insert Latex',
        el: latexButton,
    }

    // Create the Clear Content toolbar button
    const clearIcon = document.createElement('img');
    clearIcon.src = clearImgSrc;
    clearIcon.style.width = '24px;';
    clearIcon.style.height = '24px';
    clearIcon.style.marginTop = '2px';

    const clearButton = document.createElement('button');
    clearButton.style.cursor = 'pointer';
    clearButton.style.background = 'none';
    clearButton.style.alignSelf = 'center';
    clearButton.style.setProperty('margin', '0px', 'important');
    clearButton.appendChild(clearIcon);
    clearButton.addEventListener('click', () => {
        editor.setMarkdown('');
    });

    const clearTool = {
        name: 'Clear content',
        tooltip: 'Clear content',
        el: clearButton,
    };

    // Create the custom editor
    const editor = new Editor({
        el: editorElement,
        previewStyle: isMobile ? 'tab' : 'vertical',
        height: '500px',
        initialEditType: "markdown",
        placeholder: "Please enter your text here",
        toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'image', 'link'],
            ['code', 'codeblock', latexTool, clearTool],
            ['scrollSync'],
        ],
        customHTMLRenderer: customHTMLRenderer,
        plugins: [
            fontSize,
            [codeSyntaxHighlight, { highlighter: Prism }],
            colorSyntax,
        ],
        hooks: {
            // Instead of using base64, we use cloudinary API to host it as a URL
            async addImageBlobHook(blob) {
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('upload_preset', 'ml_default');
                formData.append('api_key', '237145998445384');

                // Find the OK button (toastui-editor-ok-button) and set it to a loading state
                const okButton = document.querySelector('.toastui-editor-ok-button');
                if (okButton) {
                    okButton.classList.add('loading');
                    okButton.innerHTML = 'Uploading...';
                    okButton.disabled = true;
                }

                try {
                    const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
                        method: 'POST',
                        body: formData
                    });

                    const uploadResult = await response.json();

                    if (uploadResult.secure_url) {
                        const altText = document.getElementById('toastuiAltTextInput');
                        let imgText = "$$img\n" +
                            "Tip: add any CSS styles as key value pairs below to customize the image\n" +
                            "width:auto\n" +
                            "height:auto\n" +
                            `![${altText.textContent}](${uploadResult.secure_url})\n` +
                            "$$";
                        if (editor.getSelection()[0][1] !== 1) {
                            imgText = "\n" + imgText;
                        }
                        editor.insertText(imgText);
                    } else {
                        console.error('Upload failed:', uploadResult);
                    }
                } catch (error) {
                    console.error('Error uploading the image:', error);
                } finally {
                    if (okButton) {
                        okButton.classList.remove('loading');
                        okButton.innerHTML = 'OK';
                        okButton.disabled = false;
                    }
                }
            }
        }
    });

    return editor;
}

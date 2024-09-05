import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/editor';

export default function initializeEditor(elementId = null, content = '') {
    const generatedId = elementId || 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');

    let editorElement = document.querySelector(`#${generatedId}`);

    if (!editorElement) {
        editorElement = document.createElement('div');
        editorElement.id = generatedId;
        document.body.appendChild(editorElement);
    }

    return new Editor({
        el: editorElement,
        previewStyle: 'vertical',
        height: '500px',
        initialValue: content,
    });
}

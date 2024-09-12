import { parse, HtmlGenerator } from 'latex.js';

export const customHTMLRenderer = {
    latex(node) {
        const generator = new HtmlGenerator({ hyphenate: false });
        const { body } = parse(node.literal, { generator: generator }).htmlDocument();

        // Remove the katex-html part as it looks ugly and is unnecessary
        let tempElement = document.createElement('div');
        tempElement.innerHTML = body.innerHTML;
        tempElement.querySelectorAll('.katex-html').forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        return [
            { type: 'openTag', tagName: 'div', outerNewLine: true },
            { type: 'html', content: tempElement.innerHTML },
            { type: 'closeTag', tagName: 'div', outerNewLine: true }
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
                { type: 'openTag', tagName: 'div', outerNewLine: true },
                { type: 'closeTag', tagName: 'div', outerNewLine: true }
            ];
        }

        imgAttributes['alt'] = match[1];
        imgAttributes['src'] = match[2];
        if (style) {
            imgAttributes['style'] = style;
        }

        return [
            { type: 'openTag', tagName: 'div', outerNewLine: true },
            {
                type: 'openTag',
                tagName: 'img',
                outerNewLine: false,
                attributes: imgAttributes,
                selfClosing: true
            },
            { type: 'closeTag', tagName: 'div', outerNewLine: true }
        ];
    }
};

<template>
  <div class="components-container">
    <div class="editor-container" id="editor"></div>
    <el-row>
      <el-upload
          class="import-button"
          action="https://jsonplaceholder.typicode.com/posts/"
          accept=".md, .txt"
          :on-change="importMD"
          multiple
          :limit="1">
        <el-button
            type="primary"
            plain
            icon="Upload">
          Import
        </el-button>
      </el-upload>
      <el-button
          class="export-button"
          type="primary"
          plain
          icon="Download"
          @click="exportMD">
        Export
      </el-button>
      <el-button
          class="render-pdf-button"
          type="primary"
          plain
          icon="MagicStick"
          @click="renderPDF">
        Render as PDF
      </el-button>
    </el-row>
  </div>
</template>

<script>
import {jsPDF} from 'jspdf';
import {marked} from 'marked';
import html2canvas from 'html2canvas';
import {ElButton} from 'element-plus';
import {Download} from '@element-plus/icons-vue';
import initializeEditor from '@/components/MarkdownEditor/init';
import html2pdf from 'html2pdf.js';


const content = `**This is test**

* vue
* element
* webpack`;

let editor = null;

export default {
  components: {
    ElButton,
    Download
  },
  data() {
    return {
      content: content,
      isMathJaxLoaded: false,
    };
  },
  mounted() {
    editor = initializeEditor('editor', this.content);
    this.loadMathJax();
  },
  methods: {
    loadMathJax() {
      if (this.isMathJaxLoaded) return;

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => {
        this.isMathJaxLoaded = true;
        console.log('MathJax loaded');
      };
      document.head.appendChild(script);
    },
    async importMD(res) {
      const file = res.raw || res.file;  // Ensure correct file object

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const fileContent = e.target.result;

          if (fileContent) {
            editor.setMarkdown(fileContent);
          } else {
            console.error("Uploaded file is empty");
          }
        };

        reader.readAsText(file);
      } else {
        console.error("No file uploaded");
      }
    },
    async exportMD() {
      // TODO
    },
    async renderPDF() {
      let markdownHTML = '';

      // Get the HTML or Markdown content from the editor
      if (editor.isWysiwygMode()) {
        markdownHTML = editor.getHTML();
        console.log(markdownHTML);
      } else if (editor.isMarkdownMode()) {
        const markdownContent = editor.getMarkdown();
        markdownHTML = marked(markdownContent);
      }

      // Create a temporary element to hold the content for rendering
      const tempElement = document.createElement('div');
      tempElement.innerHTML = markdownHTML;

      // Apply CSS to ensure text wrapping and proper styling
      const style = document.createElement('style');
      style.innerHTML = `
        body, div, p, ul, li, span, a {
          font-size: 12px;
          line-height: 1.6;
          font-family: Arial, sans-serif;
          margin: 0;
          word-wrap: break-word;
        }
        pre, code, blockquote, table {
          page-break-inside: avoid;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        h1 {
          font-size: 26px;
          margin-bottom: 12px;
        }
        h2 {
          font-size: 22px;
          margin-bottom: 10px;
        }
        h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        h4 {
          font-size: 18px;
          margin-bottom: 6px;
        }
        h5 {
          font-size: 16px;
          margin-bottom: 4px;
        }
        h6 {
          font-size: 14px;
          margin-bottom: 2px;
        }
        .page-break {
          page-break-before: always; /* Forces content after this class to be on a new page */
        }
      `;
      tempElement.appendChild(style);

      // Wrap the content inside a container with the necessary margins
      const wrapper = document.createElement('div');
      wrapper.classList.add('content-wrapper');
      wrapper.innerHTML = tempElement.innerHTML;
      document.body.appendChild(wrapper);

      // Render MATHML
      if (this.isMathJaxLoaded) {
        await MathJax.typesetPromise([wrapper]);
      } else {
        console.error("MathJax is not loaded yet");
      }

      // Use html2pdf to generate the PDF from the content
      const options = {
        margin: [25.4, 25.4, 25.4, 25.4], // Margins in mm
        filename: 'exported-markdown.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().from(wrapper).set(options).save();

      // Remove the temporary element after generating the PDF
      document.body.removeChild(wrapper);
    }
  }
};
</script>

<style scoped>
.render-pdf-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.editor-container {
  margin-bottom: 20px;
  height: 300px;
  border: 1px solid #ddd;
}

.export-button {
  margin-left: 12px;
}
</style>


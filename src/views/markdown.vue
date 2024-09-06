<template>
  <div class="components-container">
    <div class="editor-container" id="editor"></div>
    <ElButton
        class="export-pdf-button"
        type="primary"
        icon="Download"
        @click="exportPDF"
    >
      Export PDF
    </ElButton>
  </div>
</template>

<script>
import {jsPDF} from 'jspdf';
import {marked} from 'marked';
import html2canvas from 'html2canvas';
import {ElButton} from 'element-plus';
import {Download} from '@element-plus/icons-vue';
import initializeEditor from '@/components/MarkdownEditor/init';

const content = `**This is test**

* vue
* element
* webpack`;

export default {
  components: {
    ElButton,
    Download
  },
  data() {
    return {
      editor: null,
      content1: content,
      html: '',
    };
  },
  mounted() {
    this.editor = initializeEditor('editor', this.content1);
  },
  methods: {
    async exportPDF() {
      let markdownHTML = '';

      // Check if the editor is in WYSIWYG mode
      if (this.editor.isWysiwygMode()) {
        // Safely retrieve the HTML content in WYSIWYG mode
        markdownHTML = this.editor.getHTML();
      } else if (this.editor.isMarkdownMode()) {
        // Convert Markdown content to HTML using marked.js
        const markdownContent = this.editor.getMarkdown();
        markdownHTML = marked(markdownContent); // Convert Markdown to HTML
      }

      // Create an off-screen element to render the HTML content
      const tempElement = document.createElement('div');
      tempElement.innerHTML = markdownHTML;

      // Apply CSS to set text size to 12px and ensure margins similar to Google Docs
      const style = document.createElement('style');
      style.innerHTML = `
        body, div, p, ul, li, span, a {
          font-size: 12px;
            line-height: 1.6;
            font-family: Arial, sans-serif;
            margin: 0;
          }
        .content-wrapper {
          padding-top: 25.4mm;
          padding-bottom: 25.4mm;
          padding-left: 25.4mm;
          padding-right: 25.4mm;
          width: auto;
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
      `;
      tempElement.appendChild(style);

      // wrap content inside a container with margins
      const wrapper = document.createElement('div');
      wrapper.classList.add('content-wrapper');
      wrapper.innerHTML = tempElement.innerHTML;
      document.body.appendChild(wrapper);

      // capture the content of the element as an image
      const canvas = await html2canvas(wrapper, {
        scale: 4,  // resolution
      });

      // generate the PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;  // A4 width in mm
      const pageHeight = 297;  // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // add the image of the content to the PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // add more pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(wrapper);

      pdf.save('exported-markdown.pdf');
    }
  }
};
</script>

<style scoped>
.export-pdf-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.editor-container {
  margin-bottom: 30px;
  height: 300px;
  border: 1px solid #ddd;
}
</style>


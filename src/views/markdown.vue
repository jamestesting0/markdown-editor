<template>
  <div class="components-container">
    <div class="switch-button-container">
      <el-button
          class="switch-mode-button"
          type="primary"
          plain
          @click="toggleMode"
          :disabled="!hasPermission()"
          :icon="getIcon()"
      >
        {{ isViewerMode ? 'Switch to Editor' : 'Switch to Viewer' }}
      </el-button>
    </div>
    <div class="editor-container" id="editor"></div>
    <div class="viewer-container" id="viewer" style="display: none;"></div>
    <el-row>
      <el-upload
          class="import-button"
          action="https://jsonplaceholder.typicode.com/posts/"
          accept=".md, .txt"
          :on-change="importMD"
          multiple
          :limit="1"
          :disabled="!hasPermission()">
        <el-button type="primary" plain icon="Upload" :disabled="!hasPermission()">
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
      <el-button
          class="download-html-button"
          type="primary"
          plain
          icon="Share"
          @click="downloadHTML">
        Download HTML
      </el-button>
    </el-row>
    <PopupMessage :message="errorMessage" />
  </div>
</template>

<script>
import { ElButton, ElUpload } from 'element-plus';
import initializeEditor from '@/components/MarkdownEditor/editor_init';
import initializeViewer from '@/components/MarkdownEditor/viewer_init';
import html2pdf from 'html2pdf.js';
import PopupMessage from '../components/PopupMessage/popup_message.vue';

let editor = null;
let viewer = null;

export default {
  components: {
    ElButton,
    ElUpload,
    PopupMessage,
  },
  data() {
    return {
      isViewerMode: false,
      isMathJaxLoaded: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.loadMathJax();
    this.initializeEditor(this.isMobile());
    this.initializeViewer();
    setTimeout(() => {
      this.loadMarked();
      this.checkPermissions();
    }, 100);
  },
  methods: {
    isMobile() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    saveMarked(content) {
      // TODO: implement custom logic here
      try {
        localStorage.setItem('markedContent', content);
      } catch (e) {
        this.logError("Failed to save content");
      }
    },
    loadMarked() {
      // TODO: implement custom logic here
      try {
        const savedContent = localStorage.getItem('markedContent');
        if (savedContent) {
          editor.setMarkdown(savedContent);
        }
      } catch (e) {
        this.logError("Failed to load content");
      }
      editor.moveCursorToStart();
    },
    checkPermissions() {
      if (!this.hasPermission()) {
        this.isViewerMode = true;
        this.showViewer();
      }
    },
    hasPermission() {
      // TODO: implement custom logic for permission checks
      return true;
    },
    getIcon() {
      return this.isViewerMode ? "Edit" : "View"
    },
    toggleMode() {
      if (this.hasPermission()) {
        this.isViewerMode = !this.isViewerMode;
        if (this.isViewerMode) {
          this.showViewer();
        } else {
          this.showEditor();
        }
      }
    },
    initializeEditor(isMobile) {
      editor = initializeEditor('editor', isMobile);
      editor.on("change", () => {
        const content = editor.getMarkdown();
        this.saveMarked(content);
      });
    },
    initializeViewer() {
      viewer = initializeViewer('viewer');
    },
    syncViewer() {
      const markdownContent = editor.getMarkdown();
      viewer.setMarkdown(markdownContent);
    },
    showEditor() {
      document.getElementById('editor').style.display = 'block';
      document.getElementById('viewer').style.display = 'none';
    },
    showViewer() {
      this.syncViewer();
      document.getElementById('editor').style.display = 'none';
      document.getElementById('viewer').style.display = 'block';
    },
    logError(message) {
      console.error(message);
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    },
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
    async downloadHTML() {
      // Get the HTML content from the editor
      const htmlContent = editor.getHTML();
      if (!htmlContent) {
        this.logError("No content to export");
        return;
      }

      // Create a temporary wrapper to hold the HTML content
      const wrapper = document.createElement('div');
      wrapper.innerHTML = htmlContent;

      // Remove all elements with the 'tool' class
      const toolElements = wrapper.querySelectorAll('.tool');
      toolElements.forEach(element => element.remove());

      // Get the updated HTML content with the 'tool' elements removed
      const cleanedHtmlContent = wrapper.innerHTML;

      // Create a Blob object with the cleaned HTML content
      const blob = new Blob([cleanedHtmlContent], { type: 'text/html' });

      // Create a download link and simulate a click to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported-content.html';

      // Append the link, trigger the download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async importMD(res) {
      const file = res.raw || res.file;

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const fileContent = e.target.result;

          if (fileContent) {
            editor.setMarkdown(fileContent);
          } else {
            this.logError("Uploaded file is empty");
          }
        };

        reader.readAsText(file);
      } else {
        this.logError("No file uploaded");
      }
    },
    async exportMD() {
      const markdownContent = editor.getMarkdown();
      if (!markdownContent) {
        this.logError("No content to export")
        return;
      }

      // Create a Blob object with the Markdown content
      const blob = new Blob([markdownContent], { type: 'text/markdown' });

      // Create a download link and simulate a click to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported-content.md';

      // Append a link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async renderPDF() {
      let markdownHTML = '';

      // Get the HTML or Markdown content from the editor
      markdownHTML = editor.getHTML();

      // Create a temporary element to hold the content for rendering
      const tempElement = document.createElement('div');
      tempElement.innerHTML = markdownHTML;

      // Convert image URLs to base64, otherwise they do not get rendered in the PDF
      await this.convertImagesToBase64(tempElement);

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
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
          padding: 8px;
        }

        th {
          font-weight: bold;
        }

        td {
          text-align: left;
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
        this.logError("MathJax is not loaded yet");
      }

      // Use html2pdf to generate the PDF from the content
      const options = {
        margin: [25.4, 25.4, 25.4, 25.4], // Margins in mm
        filename: 'exported-markdown.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        html2canvas: { scale: 4, useCORS: true },
      };

      await html2pdf().from(wrapper).set(options).save();

      // Remove the temporary element after generating the PDF
      document.body.removeChild(wrapper);
    },
    async convertImagesToBase64(element) {
      const images = element.querySelectorAll('img');
      const promises = [];

      images.forEach((img) => {
        promises.push(
            new Promise(async (resolve, reject) => {
              try {
                const response = await fetch(img.src);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                  img.src = reader.result;
                  resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              } catch (error) {
                reject(error);
              }
            })
        );
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        this.logError("Error converting images to base64:", error);
      }
    }
  }
};
</script>

<style scoped>
.editor-container {
  margin-bottom: 20px;
  margin-top: 40px;
  height: 500px;
  border: 1px solid #ddd;
  resize: vertical;
  overflow: hidden;
}

.viewer-container {
  margin-bottom: 20px;
  margin-top: 40px;
  height: 500px;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
  resize: vertical;
}

.render-pdf-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.export-button {
  margin-left: 12px;
}

.switch-button-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: auto;
  height: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
}

.switch-mode-button {
  border: none;
  cursor: pointer;
  clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  margin: 0;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>


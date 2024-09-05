<template>
  <div class="components-container">
    <div class="editor-container" id="editor"></div>

    <!-- Ensure the text and icon are centered within the button -->
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
import { ElButton } from 'element-plus'; // Import the Element Plus Button component
import { Download } from '@element-plus/icons-vue'; // Import the Download icon from Element Plus
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
    exportPDF() {
      console.log('Exporting to PDF...');
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


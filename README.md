# CHUK Custom Markdown Editor

## Functionalities
1. Support all basic Markdown syntax. (Default TUI Editor)
2. Support for editing text fonts and color. (TUI Plugins)
3. Custom image editing syntax that supports all CSS styles.
4. Custom latex syntax based on KATEX.
5. HTML to PDF rendering.
6. Export/import Markdown files.
7. Viewer/editor mode switch.
8. HTML source download.
9. Saving/loading of Markdown content.
10. Free third-party image cloud hosting.
11. Appropriate editor preview style to better support both PC and mobile usage.

## Extending Functionalities
1. Customize `hasPermission()` method in `src/views/markdown.vue`, which determines whether the user will be in editor or viewer mode.
2. Customize `loadMarked()` and `saveMarked()` methods in `src/views/markdown.vue`, which can be customized based on how the Markdown content will be kept persistent.
3. Additional custom syntax can be added in `src/components/MarkdownEditor/html_renderers.js`
4. Tools of the editor can be modified in `src/components/MarkdownEditor/editor_init.js`

## Adding Encryption
Currently, no encryption/decryption is implemented to protect sensitive data. Here is a list of things that should potentially be encrypted.
1. Export/import of Markdown files.
2. Storing of Markdown files.
3. Upload of images for cloud hosting.
   1. The editor uses Cloudinary (third-party API) to host local images in the cloud. To add encryption, developing custom image hosting API is probably necessary.
4. Other. 

## Compatability
The editor is based on Vue 3. In order for it to be compatible with Vue 2 the following changes need to be made.
1. `plugin:vue/vue3-essential` should be changed to `plugin:vue/essential`.
2. `element-plus` package need to be replaced with the older `element-ui`.
3. `createApp` should be replaced with `new Vue()` in `main.js`.

## Running the Demo
```shell
npm install
npm run serve
```
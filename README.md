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

## Extending Functionalities
1. `hasPermission()` method, which determines whether the user will be in editor or viewer mode.
2. `loadMarked()` and `saveMarked()` methods, which can be customized based on how the Markdown content will be kept persistent.

## Adding Encryption
Currently, no encryption/decryption is implemented to protect sensitive data. Here is a list of things that should potentially be encrypted.
1. Export/import of Markdown files
2. Storing of Markdown files
3. Upload of images to for cloud hosting
   1. The editor uses Cloudinary (third-party API) to host local images in the cloud. To add encryption, developing custom image hosting API is probably necessary.
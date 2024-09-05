import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Import Element Plus CSS
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; // Import icons

const app = createApp(App);

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.mount('#app');

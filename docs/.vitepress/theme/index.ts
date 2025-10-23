import DefaultTheme from "vitepress/theme";
import "./custom.css";
import Mermaid from "../components/Mermaid.vue";

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.component("Mermaid", Mermaid);
  },
};

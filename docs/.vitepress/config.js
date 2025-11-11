import mermaidPlugin from "./plugins/mermaidPlugin";

const commonPath = "/menu3";
// 从环境变量读取版本号
const version = process.env.DOCS_VERSION || "latest";

export default {
  base: `/github-server01/`,
  title: "小甘博客" + version, // 所有文档的浏览器标签title
  description: "小甘博客", // 会渲染成<meta>标签，SEO用
  markdown: {
    config: (md) => {
      md.use(mermaidPlugin);
    },
  },
  themeConfig: {
    siteTitle: "小甘博客",
    logo: "/logo.jpg",
    nav: [
      {
        text: "前端",
        link: "/Pages/FrontEnd/index",
        activeMatch: "/Pages/FrontEnd/",
      },
      {
        text: "python",
        link: "/Pages/Python/index",
        activeMatch: "/Pages/Python/index",
      },
      {
        text: "后端",
        link: "/Pages/RearEnd/index",
        activeMatch: "/Pages/RearEnd/index",
      },
      { text: "测试", link: "/menu3/", activeMatch: "/menu3/" },
    ],
    // 设置nav的侧边导航栏
    sidebar: {
      "/Pages/FrontEnd/": [
        {
          text: "Quill富文本组件",
          collapsible: true,
          collapsed: false,
          items: [
            { text: "测试1", link: `/Pages/FrontEnd/01-Quill.md` }, // /guide/index.md
            { text: "测试2", link: `/Pages/FrontEnd/02-Quill.md` }, // /guide/one.md
          ],
        },
        {
          text: "section 菜单3",
          collapsible: true,
          collapsed: false,
          items: [
            { text: "测试3", link: `/Pages/FrontEnd/01-Quill.md` }, // /guide/index.md
            { text: "测试4", link: `/Pages/FrontEnd/02-Quill.md` }, // /guide/one.md
          ],
        },
      ],
      "/menu3/": [
        {
          text: "section 菜单3",
          collapsible: true,
          collapsed: false,
          items: [
            { text: "a", link: `${commonPath}/a.md` }, // /guide/index.md
            { text: "b", link: `${commonPath}/b.md` }, // /guide/one.md
          ],
        },
        {
          text: "menu3 section 2",
          collapsible: true,
          collapsed: false,
          items: [
            { text: "c", link: `${commonPath}/c.md` }, // /guide/two.md
            { text: "d", link: `${commonPath}/d.md` }, // /guide/one.md
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
      { icon: "twitter", link: "..." },
      { icon: "discord", link: "..." },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present feiye",
    },

    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },

    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "多语言",
    outlineTitle: "所有内容👇",
  },
};

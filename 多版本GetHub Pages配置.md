# 多版本GetHub Pages配置

## 仓库基础配置

用于匹配指定分支

![image-20251112093149885](images\image-20251112093149885.png)

## pages配置

gh-pages分支专门用来存储生成的静态html分支来做pages服务的渲染

![image-20251112115341759](images\image-20251112115341759.png)



## 可用配置deploy.yml多版本vitePress配置文件

```yml
name: Deploy Multi-Version VitePress to GitHub Pages

on:
  push:
    branches: [main]
    tags:
      - 'v*'

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout current branch/tag
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Install dependencies
        run: npm ci

      - name: Determine current version
        id: version
        run: |
          if [[ $GITHUB_REF == refs/tags/v* ]]; then
            VERSION=${GITHUB_REF#refs/tags/}
            echo "version=$VERSION" >> $GITHUB_OUTPUT
            echo "is_tag=true" >> $GITHUB_OUTPUT
          else
            VERSION="latest"
            echo "version=$VERSION" >> $GITHUB_OUTPUT
            echo "is_tag=false" >> $GITHUB_OUTPUT
          fi
          echo "🏷️ Current version: $VERSION"

      - name: Fetch all versions (tags)
        id: all_versions
        run: |
          git fetch --tags
          VERSIONS=$(git tag -l 'v*' | sort -V -r | jq -R -s -c 'split("\n")[:-1]')
          echo "versions=$VERSIONS" >> $GITHUB_OUTPUT
          echo "📦 All versions: $VERSIONS"

      - name: Checkout gh-pages branch
        run: |
          git fetch origin gh-pages:gh-pages || git branch gh-pages
          git checkout gh-pages
          git pull origin gh-pages || true
          
          # 创建临时目录保存现有内容
          mkdir -p /tmp/gh-pages-backup
          if [ -d "." ] && [ "$(ls -A)" ]; then
            cp -r . /tmp/gh-pages-backup/ || true
          fi
          
          # 切换回原分支
          git checkout -

      - name: Install dependencies
        run: npm install

      - name: Build current version
        env:
          DOCS_VERSION: ${{ steps.version.outputs.version }}
          ALL_VERSIONS: ${{ steps.all_versions.outputs.versions }}
        run: |
          echo "🔨 Building version: $DOCS_VERSION"
          # 暂时注释掉，改用vitepress命令
          npm run docs:build 
          # npx vitepress build docs

      - name: Prepare deployment with all versions
        run: |
          CURRENT_VERSION="${{ steps.version.outputs.version }}"
          
          # 创建最终部署目录
          mkdir -p dist_final
          
          # 恢复所有已有版本（除了当前要更新的版本）
          if [ -d "/tmp/gh-pages-backup" ]; then
            echo "📂 Restoring existing versions..."
            cp -r /tmp/gh-pages-backup/* dist_final/ || true
            
            # 删除当前版本的旧内容（如果存在）
            if [ -d "dist_final/$CURRENT_VERSION" ]; then
              echo "🗑️ Removing old version: $CURRENT_VERSION"
              rm -rf "dist_final/$CURRENT_VERSION"
            fi
          fi
          
          # 复制新构建的当前版本
          echo "📦 Adding new version: $CURRENT_VERSION"
          mkdir -p "dist_final/$CURRENT_VERSION"
          cp -r docs/.vitepress/dist/* "dist_final/$CURRENT_VERSION/"
          
          # 列出所有版本
          echo "📋 Available versions in dist_final:"
          ls -la dist_final/

      - name: Generate version index page
        env:
          ALL_VERSIONS: ${{ steps.all_versions.outputs.versions }}
        run: |
          node scripts/generate-versions-index.js

      - name: Create .nojekyll file
        run: touch dist_final/.nojekyll

      - name: Deploy to gh-pages branch
        run: |
          cd dist_final
          git init
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add -A
          git commit -m "Deploy version ${{ steps.version.outputs.version }} - $(date '+%Y-%m-%d %H:%M:%S')"
          git branch -M gh-pages
          git remote add origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push -f origin gh-pages

      - name: Summary
        run: |
          echo "## 🎉 Deployment Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "✅ **Deployed Version:** \`${{ steps.version.outputs.version }}\`" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "🔗 **Access URLs:**" >> $GITHUB_STEP_SUMMARY
          echo "- 🏠 All Versions: https://xiaoganwudi.github.io/github-server01/" >> $GITHUB_STEP_SUMMARY
          echo "- 📌 Latest: https://xiaoganwudi.github.io/github-server01/latest/" >> $GITHUB_STEP_SUMMARY
          echo "- 📦 Current: https://xiaoganwudi.github.io/github-server01/${{ steps.version.outputs.version }}/" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "📚 **Available Versions:** \`latest\`, ${{ steps.all_versions.outputs.versions }}" >> $GITHUB_STEP_SUMMARY
```


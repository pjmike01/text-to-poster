#!/usr/bin/env node
/**
 * Text to Poster Skill - 主入口
 * 将文字内容转换为杂志风海报并截图
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 海报生成提示词模板
const POSTER_PROMPT_TEMPLATE = `你是一个专业的海报设计师和前端开发工程师。
请根据以下文字内容，生成一个符合设计规范的杂志风海报 HTML。

【设计规范】
1. 配色：基底色 #F1F0EC，强调色 #FF7D00（橙色高亮），深色卡片使用 #121212 底色、白色文字，禁止使用纯白。
2. 字体：使用 Oswald（英文标题）、Noto Serif SC（中文标题粗体）、Noto Sans SC（正文）。
3. 布局：横向滑动翻页，卡片锁定比例 flex-shrink:0，一页一个核心模块，浅色深色卡片交替。
4. 样式：所有内容使用浅灰色圆角卡片区块包裹，关键词/关键句橙色高亮，标题巨大醒目、正文清晰易读，信息层级明确。
5. 技术：纯 HTML + Tailwind CSS，单文件包含全部样式，使用 Google Fonts CDN。

【内容要求】
完整展示以下全部文字，不删减、不概括、不简化，保持原文结构与段落，分页面清晰呈现：

{{CONTENT}}

【输出要求】
请只输出完整的 HTML 代码，不要包含任何解释文字。HTML 必须：
1. 包含完整的 head 和 body
2. 使用 Tailwind CSS (CDN: https://cdn.tailwindcss.com)
3. 引入 Google Fonts: Oswald, Noto Serif SC, Noto Sans SC
4. 添加噪点滤镜效果 (opacity:0.08, multiply)
5. 实现横向滑动容器 (.poster-container) 和滑动卡片 (.poster-slide)
6. 深色浅色卡片交替显示
7. 添加页面指示器 (dots)
8. 代码干净无错误、可正常运行

请生成海报 HTML：`;

/**
 * 保存内容到临时文件
 */
function saveContentToFile(content) {
  const tmpDir = path.join(__dirname, '.tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const timestamp = Date.now();
  const contentPath = path.join(tmpDir, `content-${timestamp}.txt`);
  fs.writeFileSync(contentPath, content, 'utf-8');
  return contentPath;
}

/**
 * 保存 LLM 生成的 HTML
 */
function saveGeneratedHTML(html, outputDir = './output') {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const timestamp = Date.now();
  const htmlPath = path.join(outputDir, `poster-${timestamp}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  return htmlPath;
}

/**
 * 使用 Playwright 截图
 */
async function captureScreenshots(htmlPath, outputDir = './output') {
  const { capturePoster } = require('./screenshot');
  return await capturePoster(htmlPath, outputDir);
}

/**
 * 打印使用说明
 */
function printUsage() {
  console.log(`
用法:
  node index.js <内容文件路径> [选项]

选项:
  --output, -o    输出目录 (默认: ./output)
  --html-only     仅生成 HTML，不截图
  --help, -h      显示帮助

示例:
  node index.js ./content.txt
  node index.js ./content.txt -o ./my-posters
  node index.js ./content.txt --html-only
`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);

  // 显示帮助
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const contentPath = args[0];
  const outputDirArg = args.find((arg, i) => (arg === '--output' || arg === '-o') && args[i + 1]);
  const outputDir = outputDirArg ? args[args.indexOf(outputDirArg) + 1] : './output';
  const htmlOnly = args.includes('--html-only');

  // 检查文件
  if (!fs.existsSync(contentPath)) {
    console.error(`❌ 错误: 文件不存在 ${contentPath}`);
    process.exit(1);
  }

  // 读取内容
  const content = fs.readFileSync(contentPath, 'utf-8');
  console.log(`📄 已读取内容: ${content.length} 字符`);

  // 生成提示词
  const prompt = POSTER_PROMPT_TEMPLATE.replace('{{CONTENT}}', content);

  // 保存提示词到临时文件（供 LLM 使用）
  const promptPath = path.join(__dirname, '.tmp', `prompt-${Date.now()}.txt`);
  if (!fs.existsSync(path.dirname(promptPath))) {
    fs.mkdirSync(path.dirname(promptPath), { recursive: true });
  }
  fs.writeFileSync(promptPath, prompt, 'utf-8');

  console.log('\n📝 提示词已生成。请使用 Claude Code 的 @skill 功能调用此 Skill。');
  console.log(`\n提示词文件: ${promptPath}`);
  console.log('\n操作流程:');
  console.log('1. Claude 将使用上述提示词生成海报 HTML');
  console.log('2. 生成的 HTML 将保存到输出目录');
  if (!htmlOnly) {
    console.log('3. 使用 Playwright 对海报进行截图');
  }
}

// 命令行入口
if (require.main === module) {
  main().catch(err => {
    console.error('❌ 错误:', err.message);
    process.exit(1);
  });
}

module.exports = {
  POSTER_PROMPT_TEMPLATE,
  saveContentToFile,
  saveGeneratedHTML,
  captureScreenshots
};

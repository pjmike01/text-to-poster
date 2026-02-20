#!/usr/bin/env node
/**
 * 海报 HTML 截图脚本 - 竖版卡片布局
 * 使用 Playwright 将竖向排列的每一页卡片截图保存
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capturePoster(htmlPath, outputDir = './output') {
  if (!fs.existsSync(htmlPath)) {
    console.error(`错误: 文件不存在 ${htmlPath}`);
    process.exit(1);
  }

  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  // 启动浏览器
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1440 } // 3:4 比例
  });
  const page = await context.newPage();

  // 加载 HTML 内容
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // 等待字体和样式加载
  await page.waitForTimeout(2000);

  // 获取所有卡片元素
  const cards = await page.locator('.card').all();
  const pageCount = cards.length;

  console.log(`检测到 ${pageCount} 页海报`);

  const baseName = path.basename(htmlPath, '.html');
  const outputFiles = [];

  // 逐页截图
  for (let i = 0; i < pageCount; i++) {
    const outputFile = path.join(outputDir, `${baseName}-page-${i + 1}.png`);

    // 截图当前卡片
    await cards[i].screenshot({
      path: outputFile
    });

    outputFiles.push(outputFile);
    console.log(`已保存: ${outputFile}`);
  }

  await browser.close();
  console.log(`\n完成！共生成 ${outputFiles.length} 张图片`);
  return outputFiles;
}

// 命令行入口
if (require.main === module) {
  const [,, htmlPath, outputDir] = process.argv;

  if (!htmlPath) {
    console.log('用法: node screenshot-vertical.js <html文件路径> [输出目录]');
    console.log('示例: node screenshot-vertical.js ./poster.html ./output');
    process.exit(1);
  }

  capturePoster(htmlPath, outputDir || './output')
    .then(() => process.exit(0))
    .catch(err => {
      console.error('截图失败:', err.message);
      process.exit(1);
    });
}

module.exports = { capturePoster };

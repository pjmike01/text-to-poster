#!/usr/bin/env node
/**
 * 海报 HTML 截图脚本
 * 使用 Playwright 将横向滑动海报的每一页截图保存
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
    viewport: { width: 1080, height: 1440 } // 3:4 比例，小红书/公众号标准尺寸
  });
  const page = await context.newPage();

  // 加载 HTML 内容
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // 等待字体和样式加载
  await page.waitForTimeout(2000);

  // 获取页面数量（通过计算滑动容器的宽度）
  const pageCount = await page.evaluate(() => {
    const container = document.querySelector('.poster-container');
    if (container) {
      const slides = container.querySelectorAll('.poster-slide');
      return slides.length;
    }
    return 1;
  });

  console.log(`检测到 ${pageCount} 页海报`);

  const baseName = path.basename(htmlPath, '.html');
  const outputFiles = [];

  // 逐页截图
  for (let i = 0; i < pageCount; i++) {
    // 滚动到对应页面
    await page.evaluate((index) => {
      const container = document.querySelector('.poster-container');
      if (container) {
        const slideWidth = container.offsetWidth;
        container.scrollTo({ left: slideWidth * index, behavior: 'instant' });
      }
    }, i);

    // 等待滚动完成
    await page.waitForTimeout(500);

    // 截图 - 截取固定 3:4 比例的卡片
    const outputFile = path.join(outputDir, `${baseName}-page-${i + 1}.png`);

    // 获取当前可见的卡片元素
    const cardLocator = page.locator('.poster-slide').nth(i).locator('.card');

    // 直接截图 - 卡片已是固定的 3:4 比例 (900x1200px)
    await cardLocator.screenshot({
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
    console.log('用法: node screenshot.js <html文件路径> [输出目录]');
    console.log('示例: node screenshot.js ./poster.html ./output');
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

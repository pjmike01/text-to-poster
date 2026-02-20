#!/usr/bin/env node
/**
 * 海报 HTML 生成脚本
 * 根据用户输入的文字内容生成杂志风海报 HTML
 */

const fs = require('fs');
const path = require('path');

/**
 * 生成海报 HTML
 * @param {string} content - 要展示的文字内容
 * @param {string} outputPath - 输出文件路径
 */
function generatePosterHTML(content, outputPath) {
  // 将内容分段，每段作为一个页面
  const segments = splitContentIntoSegments(content);

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>杂志风海报</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700;900&family=Oswald:wght@400;500;700&display=swap" rel="stylesheet">
    <style type="text/tailwindcss">
        @layer base {
            :root {
                --base-color: #F1F0EC;
                --accent-color: #FF7D00;
                --dark-card: #121212;
            }
            body {
                font-family: 'Noto Sans SC', sans-serif;
                background-color: var(--base-color);
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }
            /* 噪点滤镜 */
            .noise-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.08;
                mix-blend-mode: multiply;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }
            .font-oswald {
                font-family: 'Oswald', sans-serif;
            }
            .font-serif-cn {
                font-family: 'Noto Serif SC', serif;
            }
            .poster-container {
                display: flex;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                scroll-behavior: smooth;
                width: 100vw;
                height: 100vh;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .poster-container::-webkit-scrollbar {
                display: none;
            }
            .poster-slide {
                flex-shrink: 0;
                width: 100vw;
                height: 100vh;
                scroll-snap-align: start;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                box-sizing: border-box;
            }
            .card {
                background: rgba(255, 255, 255, 0.6);
                border-radius: 24px;
                padding: 3rem;
                max-width: 900px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(10px);
            }
            .card-dark {
                background: var(--dark-card);
                color: #F1F0EC;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
            }
            .highlight {
                color: var(--accent-color);
                font-weight: 700;
            }
            .page-indicator {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 0.5rem;
                z-index: 100;
            }
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            .dot.active {
                background: var(--accent-color);
                width: 24px;
                border-radius: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="noise-overlay"></div>

    <div class="poster-container" id="posterContainer">
        ${segments.map((segment, index) => generateSlide(segment, index)).join('')}
    </div>

    <div class="page-indicator" id="pageIndicator">
        ${segments.map((_, index) => `<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`).join('')}
    </div>

    <script>
        const container = document.getElementById('posterContainer');
        const dots = document.querySelectorAll('.dot');

        container.addEventListener('scroll', () => {
            const scrollLeft = container.scrollLeft;
            const slideWidth = container.offsetWidth;
            const currentIndex = Math.round(scrollLeft / slideWidth);

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        });
    </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`海报 HTML 已生成: ${outputPath}`);
  return outputPath;
}

/**
 * 将内容分割成多个段落（每段作为一个页面）
 */
function splitContentIntoSegments(content) {
  // 按空行分割
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

  // 如果段落太多，合并相邻段落
  const targetSegments = Math.min(Math.max(3, Math.ceil(paragraphs.length / 2)), 8);
  const segments = [];
  const itemsPerSegment = Math.ceil(paragraphs.length / targetSegments);

  for (let i = 0; i < paragraphs.length; i += itemsPerSegment) {
    const chunk = paragraphs.slice(i, i + itemsPerSegment);
    segments.push(chunk.join('\n\n'));
  }

  return segments.length > 0 ? segments : [content];
}

/**
 * 生成单个幻灯片
 */
function generateSlide(content, index) {
  const isDark = index % 2 === 1;
  const cardClass = isDark ? 'card card-dark' : 'card';

  // 处理内容：检测关键词并高亮
  const processedContent = processContent(content);

  // 判断是否包含标题（第一行较短）
  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  const hasTitle = firstLine.length < 30 && firstLine.length > 0;

  const title = hasTitle ? firstLine : '';
  const body = hasTitle ? lines.slice(1).join('\n') : content;

  return `
        <div class="poster-slide">
            <div class="${cardClass}">
                ${title ? `<h1 class="font-serif-cn text-5xl md:text-6xl font-black mb-8 leading-tight">${escapeHtml(title)}</h1>` : ''}
                <div class="prose prose-lg max-w-none">
                    ${processedContent.split('\n').map(line => {
                      if (line.trim()) {
                        return `<p class="text-xl md:text-2xl leading-relaxed mb-6 font-sans">${escapeHtml(line)}</p>`;
                      }
                      return '';
                    }).join('')}
                </div>
            </div>
        </div>`;
}

/**
 * 处理内容：高亮关键词
 */
function processContent(content) {
  // 可以在这里添加更多高亮规则
  // 例如：高亮引号内的内容、数字、特定词汇等
  return content;
}

/**
 * HTML 转义
 */
function escapeHtml(text) {
  const div = { toString: () => text };
  // 简单转义
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 命令行入口
if (require.main === module) {
  const [,, contentPath, outputPath] = process.argv;

  if (!contentPath) {
    console.log('用法: node generate.js <内容文件路径> [输出HTML路径]');
    console.log('示例: node generate.js ./content.txt ./poster.html');
    process.exit(1);
  }

  if (!fs.existsSync(contentPath)) {
    console.error(`错误: 文件不存在 ${contentPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(contentPath, 'utf-8');
  const output = outputPath || `./poster-${Date.now()}.html`;

  generatePosterHTML(content, output);
}

module.exports = { generatePosterHTML, splitContentIntoSegments };

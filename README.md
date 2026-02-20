# Text to Poster Generator

Claude Code Skill - 将文字内容转换为杂志风海报并截图生成图片。

## 功能

- 将长文本内容转换为精美的 3:4 竖版杂志风海报
- 横向滑动翻页，一页一个核心模块
- 浅色/深色卡片交替显示
- 自动截图生成多张 PNG 图片

## 安装

```bash
# 进入 Skill 目录
cd /Users/pjmike/IdeaProjects/claude_code_test/.claude/skills/text-to-poster

# 安装依赖
npm install

# 安装 Playwright 浏览器（如未自动安装）
npx playwright install chromium
```

## 使用方法

### 方式一：通过 Claude Code 调用

在 Claude Code 中直接描述你的需求：

```
将这段文字生成海报：
（粘贴你的内容）
```

### 方式二：命令行使用

```bash
# 生成海报 HTML
node generate.js ./content.txt ./output.html

# 截图
node screenshot.js ./output.html ./output

# 或者使用主脚本
node index.js ./content.txt -o ./output
```

## 输出

- `output/poster-<timestamp>.html` - 海报 HTML 文件
- `output/poster-<timestamp>-page-1.png` - 第一页截图
- `output/poster-<timestamp>-page-2.png` - 第二页截图
- ...

## 设计规范

- **配色**: 米白底色 #F1F0EC，橙色强调 #FF7D00，深色卡片 #121212
- **字体**: Oswald (英文标题), Noto Serif SC (中文标题), Noto Sans SC (正文)
- **特效**: 全局噪点滤镜 (opacity: 0.08, multiply)
- **布局**: 瑞士主义非对称网格排版

## 文件说明

| 文件 | 说明 |
|------|------|
| `CLAUDE.md` | Skill 配置文件 |
| `index.js` | 主入口脚本 |
| `generate.js` | HTML 生成脚本 |
| `screenshot.js` | 截图脚本 |
| `package.json` | 依赖配置 |

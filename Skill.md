---
type: skill
name: Text to Poster Generator
description: 将文字内容转换为3:4竖版杂志风图片, 触发关键语句：将这段文字生成海报、生成适合小红书的图片、文字转图片、将这段文字转换成图片
---

# Text to Poster Generator

将文字内容生成 **3:4 竖版杂志风** HTML5 海报，并截图产出适合小红书和公众号使用的图片。

## 工作流程

1. **文本整理分类** - **（重要步骤）**
   - 对用户输入的原始文本进行结构化处理
   - 提取核心主题，重新组织为清晰的、**符合原文语义**的层级结构
   - 根据原文适当将长段落拆分为要点/列表形式，如果不适合拆分的，不强行拆分
   - 为每个部分添加简洁的小标题
   - 可以适当提炼关键内容，但是需要符合原文语义
   - **输出**：向用户展示整理后的结构化文本，确认后再进行下一步

2. **分析内容** - 理解整理后的文本结构，按逻辑分块
3. **生成 HTML** - 根据设计规范生成 3:4 竖版海报 HTML 文件
4. **截图输出** - 使用 Playwright 将 HTML 截图保存为图片
5. **返回结果** - 向用户展示生成的图片文件路径

## 分页逻辑

请分析【输入内容】的字数和逻辑结构，自动决定卡片数量（通常为 3-6 张），遵循以下原则：

### Card 1: The Cover (封面)
- **内容**: 提炼出的主标题 + 短的副标/金句
- **设计**: 巨大字号，极简，视觉冲击力第一
- **背景色**: 使用浅色背景（米白/白色系），不要使用深色背景
- **字体规范（封面专用 - 超大字号）**:
  - 顶部引导文字（如分类/来源）: `36px - 40px` (text-4xl)，浅灰色，opacity: 0.6
  - **主标题: `128px - 144px` (text-8xl - text-9xl)**，使用 `font-serif-cn` 宋体，**font-black**
  - **主标题关键字: 使用强调色 `#FF7D00`**，字号可与主标题一致
  - **副标题/金句: `48px - 60px` (text-5xl - text-6xl)**，深灰色，**font-bold**
  - 描述文字: `24px - 30px` (text-2xl - text-3xl)，灰色
  - 底部署名: `14px - 16px`，浅灰色
- **布局策略**:
  - 使用 `flex-1 flex flex-col justify-center` 实现垂直居中自适应
  - 标签区域固定在顶部，底部信息固定在底部
  - 主标题和副标题之间保持 24-32px 间距
  - 确保标题在 900px 宽度内不换行或仅允许有意图的换行

### Card 2 ~ N-1: The Content (内容页)
- **切分原则**: 不要拥挤！一个核心观点/一个章节 = 一张卡片
- **禁止**: 一张卡片内放入两个及以上独立模块（如规则1+规则2），每个模块必须独立成卡
- **清单内容**: 使用"列表布局"（01/02/03）
- **深度解析**: 使用"图文混排布局"（左文右装饰，或上文下总结）
- **重点强调**: 必须穿插一张 Dark Mode (深色底) 卡片，用于展示核心数据、引用或最重要的概念
- **字体规范（内容页 - 大字号）**:
  - **页面大标题: `72px - 96px` (text-7xl - text-8xl)**，使用 `font-serif-cn` 宋体，**font-black**
  - **章节标题: `30px - 36px` (text-3xl)**，font-bold
  - **正文/描述: `20px - 24px` (text-xl - text-2xl)**
  - **数据/数字: `48px - 72px` (text-5xl - text-7xl)**，使用 Oswald 字体
  - **标签文字: `16px - 18px`**
  - **页码数字: `96px` (text-8xl)**，Oswald 字体，**font-black**，颜色深灰 (#333 或 #666)

- **内容页统一布局（重要）**:
  - 顶部区域（非 flex-1）:
    - 左上角：**页码数字** (`text-8xl font-black`)，行高 `0.8`
    - 右上角：**标签** (`<span class="tag">`)
    - 标题紧跟页码下方，**不使用 flex-1 justify-center**
  - 内容区域（使用 flex-1）:
    - 正文内容使用 `flex-1 flex flex-col justify-center` 垂直居中
  - 参考结构：
    ```html
    <div class="card-body">
      <!-- 顶部：页码 + 标签 -->
      <div class="flex justify-between items-start mb-6">
        <span class="font-oswald text-8xl font-black text-gray-800" style="line-height: 0.8;">01</span>
        <span class="tag">标签</span>
      </div>
      <!-- 标题紧跟顶部 -->
      <h2 class="font-serif-cn text-7xl font-black mb-6">标题</h2>
      <!-- 内容区域：垂直居中 -->
      <div class="flex-1 flex flex-col justify-center">
        <!-- 正文内容 -->
      </div>
    </div>
    ```

### Card N: The Outro (封底/总结)
- **内容**: 总结陈词、CTA（行动呼吁）或简单的结束语
- **设计**: 留白较多，沉稳收尾

## 海报设计规范

### 画布尺寸（重要）

- **画布比例**: 3:4 竖版（小红书/公众号标准比例）
- **推荐尺寸**: 1080 x 1440px（宽度 x 高度）
- **移动端优化**: 内容宽度控制在 900px 以内，确保手机阅读舒适

### 视觉风格

- **整体风格**: 瑞士主义非对称网格排版，纸媒特种纸质感
- **滤镜**: 全局叠加低透明度噪点滤镜（`opacity: 0.08`, `multiply`）
- **氛围感**: 柔和阴影 + 微妙纹理，营造高级感

### 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 基底色 | `#F1F0EC` | 温暖米白，类似特种纸 |
| 强调色 | `#FF7D00` | 活力橙色，用于高亮 |
| 深色卡片 | `#121212` | 深灰黑，用于对比页面 |
| 正文色 | `#333333` | 深灰，避免纯黑刺眼 |
| 辅助灰 | `#888888` | 次要信息 |

**禁止**: 使用纯白（`#FFFFFF`）作为背景或文字色

### 字体规范

- **英文标题**: `Oswald` - 现代几何无衬线
- **中文标题**: `Noto Serif SC` - 宋体，典雅杂志感
- **中文正文**: `Noto Sans SC` - 黑体，清晰易读
- **推荐字号比例（超大字体，醒目设计）**:
  - **封面主标题: `6rem - 9rem` (96-144px)，font-black**
  - **内容页大标题: `4.5rem - 6rem` (72-96px)，font-black**
  - **副标题/金句: `3rem - 3.75rem` (48-60px)，font-bold**
  - **章节标题: `1.875rem - 2.25rem` (30-36px)，font-bold**
  - **正文/描述: `1.25rem - 1.5rem` (20-24px)**
  - **标签/注释: `0.875rem - 1rem` (14-16px)**

### 布局规范

- **卡片边距**: `60px 48px` (上下 60px，左右 48px)
- **卡片形状**: **直角** (`border-radius: 0`)，瑞士主义风格
- **元素间距**:
  - 大模块间距: `0.75rem - 1rem` (12-16px)
  - 小模块间距: `0.25rem - 0.375rem` (4-6px)
  - 行间距: `1.4 - 1.5`
- **内容区域**: 使用 `.card-body` 包裹内容，紧贴顶部 (`padding-top: 0`)，最大化内容空间
- **装饰元素**:
  - 左侧边框高亮: `border-left: 3px solid #FF7D00`，`padding-left: 16px`
  - 圆点标记: `•` 或自定义图标
  - 分隔线: 细线 `1px solid rgba(0,0,0,0.1)`
  - 标签形状: **直角** (`border-radius: 0`)

### 内容密度

- **每页字数**: 300-500 字（根据内容复杂度调整）
- **段落控制**: 每页 4-6 个段落或模块
- **阅读节奏**: 重要内容突出显示，次要内容精简

### 小红书/公众号优化

- **首图设计**: 封面需要有强视觉冲击，标题醒目
- **信息层级**: 使用字号、颜色、粗细区分重要性
- **关键词高亮**: 橙色强调用户可能搜索的关键词
- **结尾处理**: 最后一页可添加作者信息、引导关注等

## 布局策略

### 单页布局

适用于内容较少或重点突出的页面：

```
┌─────────────────────────────┐
│  [标签]                      │
│                             │
│       大标题                 │
│       副标题                 │
│                             │
│  ├─ 要点1                   │
│  ├─ 要点2                   │
│  └─ 要点3                   │
│                             │
│  总结/引用                   │
└─────────────────────────────┘
```

### 双栏布局

适用于对比类或并列内容：

```
┌────────────┬────────────┐
│  [标签A]    │  [标签B]    │
│            │            │
│   左栏内容  │   右栏内容  │
│   • 要点1   │   • 要点1   │
│   • 要点2   │   • 要点2   │
│            │            │
└────────────┴────────────┘
```

### 列表布局

适用于多个并列条目：

```
┌─────────────────────────────┐
│  标题                        │
│                             │
│  ├─ 条目1标题               │
│  │  描述文字...             │
│  │                           │
│  ├─ 条目2标题               │
│  │  描述文字...             │
│  │                           │
│  └─ 条目3标题               │
│     描述文字...             │
└─────────────────────────────┘
```

## 技术实现

- 纯 HTML + Tailwind CSS
- 单文件包含全部样式
- 使用 Google Fonts CDN 加载字体
- 使用 Playwright 进行截图（视口设置 1080x1440）

## 输出文件

- **HTML 文件**: `output/poster-<timestamp>.html`
- **图片文件**: `output/poster-<timestamp>-page-1.png` 等
- **图片尺寸**: 1080 x 自适应高度（根据内容）

## 依赖安装

```bash
cd /Users/pjmike/IdeaProjects/claude_code_test/.claude/skills/text-to-poster
npm install
npx playwright install chromium
```

## 提示词模板

生成海报 HTML 时，使用以下提示词：

````
生成一套 3:4 竖版杂志风 HTML 海报，采用瑞士主义非对称网格排版，整体为纸媒特种纸质感，适用于小红书和公众号。

【画布规范 - 重要】
- 画布比例: 3:4 竖版 (1080x1440px)
- 卡片宽度: 900px，居中显示
- 卡片边距: 2rem (32px)
- 卡片形状: **直角** (`border-radius: 0`)

【设计规范】
1. 配色:
   - 基底色: #F1F0EC (温暖米白)
   - 强调色: #FF7D00 (活力橙)
   - 深色卡片: #121212 (深灰黑)
   - 正文色: #333333
   - 辅助灰: #888888
   - 禁止使用纯白

2. 字体 (超大字号，醒目设计):
   - 英文标题: Oswald
   - 中文标题: Noto Serif SC (粗体/黑体)
   - 中文正文: Noto Sans SC
   - 字号规范 (必须遵守):
     * **封面主标题: text-8xl 到 text-9xl (96-144px)，font-black，视觉冲击**
     * **内容页大标题: text-7xl 到 text-8xl (72-96px)，font-black**
     * **副标题/金句: text-5xl 到 text-6xl (48-60px)，font-bold**
     * **章节标题: text-3xl (30px)，font-bold**
     * **正文描述: text-xl 到 text-2xl (20-24px)**
     * **数据/数字: text-5xl 到 text-7xl，Oswald 字体**
     * **标签: text-sm (14px)**

3. 视觉元素:
   - 全局噪点滤镜 (opacity: 0.08, multiply)
   - 柔和阴影: 0 20px 60px rgba(0,0,0,0.1)
   - 左侧边框高亮: 3px solid #FF7D00，padding-left: 16px
   - 装饰性标签: 橙色**直角**小标签 (`border-radius: 0`)

4. 布局策略 (内容页统一布局):
   - **页码**: 左上角，`text-8xl font-black`，行高 `0.8`，颜色 `text-gray-800`
   - **标签**: 右上角，橙色直角标签
   - **大标题**: 紧跟页码下方，`text-7xl font-black`，**不**使用 flex-1 居中
   - **内容区**: 使用 `flex-1 flex flex-col justify-center` 垂直居中正文
   - 条目间距: margin-bottom: 16px
   - 列表布局: 左侧边框装饰 `border-left: 3px solid #FF7D00`

5. 内容密度:
   - 每页 300-450 字，字体较大留白适中
   - 重要关键词用橙色高亮
   - 正文 margin-bottom: 0，通过条目间距控制节奏

6. 技术:
   - 纯 HTML + Tailwind CSS
   - Google Fonts CDN
   - 单文件，无需外部依赖

【内容处理流程（重要）】

**第一步：文本整理分类**
请先对用户输入的原始文本进行结构化处理：
1. **提取主题**：确定内容的核心主题和副主题
2. **逻辑分层**：将内容按逻辑分为 3-6 个部分（对应 3-6 张卡片）
3. **要点提取**：将长段落转换为简洁的要点列表
4. **添加标题**：为每个部分添加简洁有力的小标题（2-6 字）
5. **标注标签**：为每张卡片确定一个关键词标签

**整理示例**：
```
原始文本：
"ClawHub 是 OpenClaw 的 Agent Skills 注册中心，类比为 Agent Skills 的 npm。用户可以发布、版本化、搜索和安装以 SKILL.md 为核心的文本技能包..."

整理后结构：
- 封面：ClawHub Skills 注册中心 | 标签：OpenClaw
- 第1页：Agent Skills 的 npm | 标签：ClawHub
  - 发布、版本化、搜索、安装
  - SKILL.md 文本技能包
- 第2页：三大核心理念 | 标签：理念
  - 软件包管理
  - 向量检索
  - 社区功能
```

**第二步：生成海报**
根据整理后的结构化内容生成 HTML。

【内容要求】
完整展示整理后的全部文字，不删减、不概括、不简化。根据内容逻辑选择合适的布局（单页/双栏/列表）：

{{USER_CONTENT}}

【输出要求】
只输出完整的 HTML 代码，不要包含 markdown 代码块标记或其他解释文字。HTML 必须包含完整的 head、body、样式和脚本，画布尺寸设置为 1080x1440 的 3:4 比例。
````

## 截图脚本使用

```bash
node screenshot.js <html文件路径> <输出目录>
```

截图脚本会自动：
1. 设置视口为 1080x1440（3:4 比例）
2. 截取每张卡片的内容
3. 移除固定高度，根据内容自适应裁剪

## 设计示例

### 封面页示例结构 (超大字号)

```html
<div class="card">
  <div class="card-body justify-between">
    <!-- 标签区域 -->
    <div class="flex gap-3 mb-8">
      <span class="tag">网易有道</span>
      <span class="tag tag-outline">桌面级应用</span>
    </div>

    <!-- 主内容区域 - 垂直居中 -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- 顶部引导文字 -->
      <div class="mb-8">
        <span class="font-oswald text-4xl text-gray-400 tracking-widest">LOSTER<span class="highlight">AI</span></span>
      </div>

      <!-- 大标题: text-9xl (144px) font-black -->
      <h1 class="font-serif-cn text-9xl font-black mb-6 leading-none">
        有道<span class="highlight">龙虾</span>
      </h1>

      <!-- 副标题: text-5xl (48px) font-bold -->
      <p class="text-5xl text-gray-800 font-bold mb-10">
        7×24 小时全场景个人 Agent
      </p>

      <!-- 描述文字: text-2xl (24px) -->
      <p class="text-2xl text-gray-500 leading-relaxed">
        从「想法」到「落地行动」<br>
        一句话指令，自主交付结果
      </p>
    </div>

    <!-- 底部信息 -->
    <div class="flex justify-between items-end">
      <div class="text-sm text-gray-400">
        <span class="block mb-1">桌面级 AI Agent</span>
        <span>重新定义个人效率</span>
      </div>
      <div class="font-oswald text-6xl font-bold text-gray-200">01</div>
    </div>
  </div>
</div>
```

### 内容页示例结构 (大字号)

```html
<div class="card">
  <div class="card-body">
    <!-- 页码 + 标签 -->
    <div class="flex justify-between items-start mb-6">
      <span class="font-oswald text-8xl font-black text-gray-800" style="line-height: 0.8;">01</span>
      <span class="tag">核心能力</span>
    </div>

    <!-- 大标题: text-7xl (72px) font-black，紧跟页码下方 -->
    <h2 class="font-serif-cn text-7xl font-black mb-6">
      直接<span class="highlight">交付结果</span>
    </h2>

    <div class="flex-1 flex flex-col justify-center">
      <!-- 描述文字: text-4xl (36px) -->
      <div class="mb-12">
        <p class="text-4xl leading-relaxed text-gray-800 font-medium">
          从 <span class="highlight">"想法"</span> 到 <span class="highlight">"落地行动"</span>
        </p>
      </div>

      <!-- 功能项: 标题 text-3xl (30px)，描述 text-xl (20px) -->
      <div class="feature-item mb-8" style="border-left: 3px solid #FF7D00; padding-left: 16px;">
        <h3 class="text-3xl font-bold mb-4">自主规划</h3>
        <p class="text-xl text-gray-600 leading-relaxed">
          根据你的指令，AI 自动拆解任务步骤，制定执行计划
        </p>
      </div>

      <div class="feature-item" style="border-left: 3px solid #FF7D00; padding-left: 16px;">
        <h3 class="text-3xl font-bold mb-4">多模态交付</h3>
        <p class="text-xl text-gray-600 leading-relaxed">
          支持文本、图片、代码、文档等复杂结果输出
        </p>
      </div>
    </div>
  </div>
</div>
```

### 深色卡片示例结构

```html
<div class="card card-dark">
  <div class="card-body">
    <!-- 页码 + 标签 -->
    <div class="flex justify-between items-start mb-6">
      <span class="font-oswald text-8xl font-black text-gray-400" style="line-height: 0.8;">02</span>
      <span class="tag tag-dark">协作系统</span>
    </div>

    <!-- 大标题: text-7xl (72px) font-black，紧跟页码下方 -->
    <h2 class="font-serif-cn text-7xl font-black mb-6">
      多角色<span class="highlight-dark">协作</span>
    </h2>

    <!-- 副标题 -->
    <p class="text-3xl text-gray-300 font-bold mb-8">
      多 Agent 协作系统
    </p>

    <div class="flex-1 flex flex-col justify-center">
      <!-- 功能列表 -->
      <div class="space-y-5 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-3 h-3 bg-orange-500 mt-2 flex-shrink-0"></div>
          <div>
            <h3 class="text-2xl font-bold mb-2">生成多个智能体</h3>
            <p class="text-gray-400 text-lg">子 Agent 扮演特定角色</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## CSS 样式参考

```css
/* 卡片基础样式 */
.card {
  background: #F1F0EC; /* 温暖米白 */
  border-radius: 0; /* 直角 */
  width: 900px;
  height: 1200px; /* 3:4 比例 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 深色卡片 */
.card-dark {
  background: #121212;
  color: #F1F0EC;
}

/* 卡片内容区域 */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 60px 48px;
  position: relative;
  z-index: 1;
}

/* 标签样式 */
.tag {
  display: inline-block;
  background: #FF7D00;
  color: white;
  padding: 8px 16px;
  border-radius: 0; /* 直角 */
  font-size: 14px;
  font-weight: 600;
}

.tag-outline {
  background: transparent;
  border: 1px solid #FF7D00;
  color: #FF7D00;
}

/* 强调色高亮 */
.highlight {
  color: #FF7D00;
  font-weight: 700;
}

/* 深色卡片高亮 */
.highlight-dark {
  color: #FF7D00;
}

/* 条目样式 - 左侧边框高亮 */
.feature-item {
  margin-bottom: 20px;
  padding-left: 16px;
  border-left: 3px solid #FF7D00;
}

/* 字号设置 - 超大字体，醒目设计 (Tailwind CSS) */
/*
   封面主标题:   text-8xl 到 text-9xl (96-144px), font-black, leading-none
   内容页大标题: text-7xl 到 text-8xl (72-96px), font-black
   副标题/金句:  text-5xl 到 text-6xl (48-60px), font-bold
   章节标题:     text-3xl (30px), font-bold
   正文描述:     text-xl 到 text-2xl (20-24px), leading-relaxed
   数据/数字:    text-5xl 到 text-7xl (48-96px), Oswald 字体
   页码:         text-8xl (96px), font-black, Oswald 字体, line-height: 0.8
*/

/* 字体类 */
.font-serif-cn { font-family: 'Noto Serif SC', serif; }
.font-oswald { font-family: 'Oswald', sans-serif; }
```
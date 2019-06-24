const path = require('path')
const fs = require('fs')
const vscode = require('vscode')

/**
 * 安装：
 *  替换css源文件
 * 
 * 卸载：
 *  剔除新增代码
 */
const CSS_PATH = path.join(path.dirname(require.main.filename), 'vs', 'workbench', 'workbench.main.css')

function clearCssContent(cssContent) {
  if (cssContent.indexOf('colorful-background-start') >= 0) {
    return cssContent.replace(/\/\*colorful-background-start\*\/[\s\S]*?\/\*colorful-background-end\*\//g, '')
  } else return cssContent
}

/**
 * 自定义配置
 *  animate 静态/动态
 *  方向 top/right/bottom/left
 *  colors 
 *  animation-duration
 *  animation-timing-function
 * 
 */
const COLOR_MAP = {
  'Dark-DeepSpace': '#1d1d1d, #6d6d6d',
  'Dark-MidnightCity': '#232526, #53636f',
  'Light-NoontoDusk': '#ff6e7f, #bfe9ff',
  'Light-Hazel': '#77a1d3, #79cbca, #e684ae',
  'diy': '#1f1c2c, #928dab'
}

function generateStyle({
  duration = 5,
  timingFunction = 'ease',
  rotate = 135,
  mode,
  diyColors = '',
}) {
  let colors = (mode === 'diy' && diyColors.length) ? diyColors : COLOR_MAP[mode]
  const baseColor = colors.split(',')[0]
  let baseBackground = `background-color: ${baseColor} !important;`
  let linearBackground = `background-image: linear-gradient(${rotate}deg, ${colors}) !important;`
  let animate = `background-size: 1000% 100%;animation: xhc-diy-animation ${duration}s ${timingFunction} infinite;`
  return {
    baseBackground,
    linearBackground,
    animate
  }
}

function init() {
  const CONFIG = vscode.workspace.getConfiguration('colorfulBackground')
  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  // 1. 清除历史样式
  cssContent = clearCssContent(cssContent)
  // 2. 生成新样式
  let { baseBackground, linearBackground, animate } = generateStyle(CONFIG)
  console.log(baseBackground, linearBackground)
  // 3. 添加新样式
  cssContent += `/*colorful-background-start*/`
  // 渐变静态背景
  + `.monaco-workbench .part,`  // 左,上,下区域
  + `.monaco-breadcrumbs,`      // 中上文件路径
  + `.monaco-editor .margin,`   // 左侧行数区域
  // + `.monaco-editor .minimap-slider,` // 右侧滑块
  + `.monaco-workbench .part.editor>.content .editor-group-container>.title` // 上方文件目录右侧
  + `{${linearBackground}}`
  // 非渐变静态背景
  + `.monaco-list .monaco-list-row.selected,`    // 左侧选中文件
  + `.monaco-panel-view .panel>.panel-header,`  // 左侧其他区域
  + `.monaco-workbench .part.editor>.content .editor-group-container>.title .tabs-container>.tab` // 已打开文件tab
  + `{${baseBackground}}`
  // 动态渐变背景
  + `.monaco-editor-background` // 编辑区
  + `{${linearBackground + animate}}`

  // 选中行颜色 .monaco-editor .selected-text
  // 当前行颜色 .monaco-editor .view-overlays .current-line

  + `@-webkit-keyframes xhc-diy-animation { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }`
  + `/*colorful-background-end*/`

  fs.writeFileSync(CSS_PATH, cssContent, 'utf-8')
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

function reset() {
  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  cssContent = clearCssContent(cssContent)
  fs.writeFileSync(CSS_PATH, cssContent, 'utf-8')
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

module.exports = {
  init,
  reset
}

// import * as path from 'path'
// import * as fs from 'fs'
const path = require('path')
const fs = require('fs')
const vscode = require('vscode')
const utils = require('./utils.js')

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
  'DeepSpace': '#000000, #434343',
  'MidnightCity': '#232526, #414345',
  'Anwar': '#334d50, #cbcaa5',
  'NoontoDusk': '#ff6e7f, #bfe9ff',
  'Transfile': '#16bffd80, #cb306680'
}

function generateStyle({
  duration = 5,
  timingFunction = 'ease',
  rotate = -45,
  opacity = 0.5,
  mode = 'DeepSpace',
  diyColors = [],
  diyBackgroundCss = ''
}) {
  let background, animate
  let colors = ''
  // set css - background
  if (diyBackgroundCss.length) {
    background = `background-image:${diyBackgroundCss}`
  } else if (diyColors.length) {
    colors = diyColors.join(',')
  } else {
    if (COLOR_MAP[mode]) colors = utils.colorFormat(COLOR_MAP[mode], opacity)
    background = `background-image: linear-gradient(${rotate}deg, ${colors}) !important;`
  }
  // set animate
  // background += ``
  animate = `background-size: 200% 200%;animation: xhc-diy-animation ${duration}s ${timingFunction} infinite;`
  return {
    background,
    animate
  }
}

function init() {
  const CONFIG = vscode.workspace.getConfiguration('colorfulBackground')
  console.log(CONFIG)

  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  // 1. 清除历史样式
  cssContent = clearCssContent(cssContent)
  // 2. 生成新样式
  let { background, animate } = generateStyle(CONFIG)
  // 3. 添加新样式
  cssContent += `/*colorful-background-start*/`
  + `.monaco-workbench .part,`
  + `.monaco-list .monaco-list-row.selected,`
  + `.monaco-panel-view .panel>.panel-header,`
  + `.monaco-breadcrumbs,`
  + `.monaco-editor .margin,`
  + `.monaco-editor .minimap-slider,`
  + `.monaco-workbench .part.editor>.content .editor-group-container>.title` 
  + `{${background}}`
  + `.monaco-editor-background`
  + `{${background + animate}}`


  // 左,上,下区域 .monaco-workbench .part
  // 左侧选中文件 .monaco-list .monaco-list-row.selected
  // 左侧其他区域 .monaco-panel-view .panel>.panel-header
  // 上方文件目录右侧 .monaco-workbench .part.editor>.content .editor-group-container>.title
  // 中上文件路径 .monaco-breadcrumbs
  // 左侧行数区域  .overflow-guard .margin // 
  // 右侧滑块 .monaco-editor .minimap.slider-mouseover .minimap-slider // 

  // 编辑区背景 .monaco-editor-background


  // 选中行颜色 .monaco-editor .selected-text
  // 当前行颜色 .monaco-editor .view-overlays .current-line
  // 右上方区域 - 被覆盖.editor-group-container>.tabs


  // 切换文件瞬间闪现
  // + `.editor-container { background-color: green !important; }`
  // 无用
  // + `.monaco-workbench>.part.editor>.container { background-color: pink !important; }`
  // + `.extension-editor { background-color: pink !important; }`
  + `@-webkit-keyframes xhc-diy-animation { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }`
  + `/*colorful-background-end*/`
  console.log('csscontent: ', cssContent)
  fs.writeFileSync(CSS_PATH, cssContent, 'utf-8')
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

function uninstall() {
  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  cssContent = clearCssContent(cssContent)
  fs.writeFileSync(CSS_PATH, cssContent, 'utf-8')
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

module.exports = {
  init,
  uninstall
}

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
  let style = ''
  let colors = ''
  // set css - background
  if (diyBackgroundCss.length) {
    style = `background-image:${diyBackgroundCss}`
  } else if (diyColors.length) {
    colors = diyColors.join(',')
  } else {
    if (COLOR_MAP[mode]) colors = utils.colorFormat(COLOR_MAP[mode], opacity)
    style = `background-image: linear-gradient(${rotate}deg, ${colors});`
  }
  // set animate
  style += `background-size: 200% 200%;`
    + `animation: xhc-diy-animation ${duration}s ${timingFunction} infinite;`
  console.log(style)
  return style
}

function init() {
  const CONFIG = vscode.workspace.getConfiguration('colorfulBackground')
  console.log(CONFIG)

  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  // 1. 清除历史样式
  cssContent = clearCssContent(cssContent)
  // 2. 生成新样式
  let newCss = generateStyle(CONFIG)
  // 3. 添加新样式
  cssContent += `/*colorful-background-start*/`
  + `[id="workbench.parts.editor"] .split-view-view .editor-container .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{${newCss}}`
  + `@-webkit-keyframes xhc-diy-animation { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }`
  + `/*colorful-background-end*/`
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

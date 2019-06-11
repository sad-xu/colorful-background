// import * as path from 'path'
// import * as fs from 'fs'
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
  'DeepSpace': '#000000, #434343',
  'ServQuick': '#485563, #29323c',
  'MidnightCity': '#232526, #414345',
  'Anwar': '#334d50, #cbcaa5',
  'NoontoDusk': '#ff6e7f, #bfe9ff'
}

function generateStyle({
  animate = true,
  duration = 15,
  timingFunction = 'ease',
  rotate = -45,
  mode = ''
  // colors
}) {
  let style = ''
  let colors = ''
  if (COLOR_MAP[mode]) colors = COLOR_MAP[mode]
  style += `background: linear-gradient(${rotate}deg, ${colors});`
  if (animate) {
    style += `background-size: 400% 400%;`
      + `animation: xhc-diy-animation ${duration}s ${timingFunction} infinite;`
  }
  return style
}


function init() {
  const CONFIG = vscode.workspace.getConfiguration('colorfulBackground')
  console.log(CONFIG)


  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  // 1. 清除历史样式
  cssContent = clearCssContent(cssContent)
  // 2. 生成新样式
  let newCss = generateStyle(CONFIG) // 'background: linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size: 400% 400%;animation: xhc-diy-animation 15s ease infinite;'
  // 3. 添加新样式
  cssContent += `/*colorful-background-start*/`
  + `[id="workbench.parts.editor"] .split-view-view .editor-container .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{${newCss}}`
  + `@-webkit-keyframes xhc-diy-animation { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }`
  + `/*colorful-background-end*/`
  console.log(cssContent.slice(-100))
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

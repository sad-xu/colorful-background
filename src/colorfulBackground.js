// import * as path from 'path'
// import * as fs from 'fs'
const path = require('path')
const fs = require('fs')
const vscode = require('vscode')

/**
 * 安装：
 *  替换css源文件
 * 
 * 
 * 卸载：
 *  剔除新增代码
 * 
 */

function init() {
  // const CONFIG = vscode.workspace.getConfiguration('colorfulBackground')
  // console.log(CONFIG)
  const CSS_PATH = path.join(path.dirname(require.main.filename), 'vs', 'workbench', 'workbench.main.css')
  console.log(CSS_PATH)
  let cssContent = fs.readFileSync(CSS_PATH, 'utf-8')
  // 1. 清除历史样式
  if (cssContent.indexOf('colorful-background-start') >= 0) {
    cssContent = cssContent.replace(/\/\*colorful-background-start\*\/[\s\S]*?\/\*colorful-background-end\*\//g, '')
  }
  // 2. 生成新样式
  let newCss = 'background: linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size: 400% 400%;animation: xhc-diy-animation 15s ease infinite;'
  // 3. 添加新样式
  cssContent += `/*colorful-background-start*/`
  + `[id="workbench.parts.editor"] .split-view-view .editor-container .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{${newCss}}`
  + `@-webkit-keyframes xhc-diy-animation { 0%{background-position: 0% 50%} 50%{background-position: 100% 50%} 100%{background-position: 0% 50%} }`
  + `/*colorful-background-end*/`
  console.log(cssContent.slice(-100))
  fs.writeFileSync(CSS_PATH, cssContent, 'utf-8')
  vscode.commands.executeCommand('workbench.action.reloadWindow')
}

module.exports = {
  init
}
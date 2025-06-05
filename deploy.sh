#!/bin/bash

# 部署脚本
# 用于构建和部署JavaScript调试绕过平台

echo "=== 开始部署 ==="

# 确保目录存在
mkdir -p dist
mkdir -p dist/js
mkdir -p dist/js/core
mkdir -p dist/js/i18n/core
mkdir -p dist/js/i18n/locales
mkdir -p dist/js/i18n/ui
mkdir -p dist/js/ui
mkdir -p dist/styles
mkdir -p dist/cases
mkdir -p dist/test-cases/execute-debugger-patterns
mkdir -p dist/test-cases/online-site
mkdir -p dist/test-cases/tools

echo "目录结构创建完成"

# 复制核心JS文件
cp js/app.js dist/js/
cp js/main-new.js dist/js/
cp js/main.js dist/js/  # 保留旧文件以确保向后兼容
cp js/compat.js dist/js/

# 复制核心模块
cp js/core/*.js dist/js/core/

# 复制国际化模块
cp js/i18n/core/*.js dist/js/i18n/core/
cp js/i18n/locales/*.js dist/js/i18n/locales/
cp js/i18n/ui/*.js dist/js/i18n/ui/
cp js/i18n/i18n-emergency-fix-new.js dist/js/i18n/

# 复制UI组件
cp js/ui/*.js dist/js/ui/

# 复制样式文件
cp styles/*.css dist/styles/

# 复制HTML文件
cp index.html dist/
cp cases/*.html dist/cases/
cp test-cases/execute-debugger-patterns/*.html dist/test-cases/execute-debugger-patterns/
cp test-cases/online-site/*.html dist/test-cases/online-site/
cp test-cases/tools/*.html dist/test-cases/tools/

echo "文件复制完成"

# 压缩和优化 (如果需要的话，需要安装相应工具)
# 这里可以添加minify、uglify等工具的使用

echo "=== 部署完成 ==="
echo "dist目录包含所有需要部署的文件" 
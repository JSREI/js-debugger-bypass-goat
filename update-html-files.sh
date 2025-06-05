#!/bin/bash

# 更新HTML文件中的脚本引用的工具脚本
# 将旧的脚本引用替换为新的模块化系统引用

echo "开始更新HTML文件..."

# 更新test-cases/execute-debugger-patterns/目录下的所有HTML文件
for file in test-cases/execute-debugger-patterns/*.html; do
  echo "处理文件: $file"
  
  # 替换旧的紧急修复版国际化脚本引用
  sed -i '' -e 's#<script src="../../js/i18n/i18n-emergency-fix.js"></script>#<script type="module" src="../../js/main-new.js"></script>\
    \
    <!-- 紧急修复版国际化脚本（如果模块化系统加载失败会作为备用） -->\
    <script src="../../js/i18n/i18n-emergency-fix-new.js"></script>#g' "$file"
  
  # 替换其他可能的旧脚本引用
  sed -i '' -e 's#<script src="../../js/i18n/zh-CN.js"></script>#<!-- 使用模块化系统 -->#g' "$file"
  sed -i '' -e 's#<script src="../../js/i18n/en-US.js"></script>##g' "$file"
  sed -i '' -e 's#<script src="../../js/i18n/i18n-core.js"></script>##g' "$file"
  sed -i '' -e 's#<script src="../../js/i18n/i18n-base.js"></script>##g' "$file"
  sed -i '' -e 's#<script src="../../js/i18n/i18n-case-detail.js"></script>##g' "$file"
  
  # 删除初始化代码
  sed -i '' -e 's#<script>\s*new I18n();\s*</script>##g' "$file"
  sed -i '' -e 's#<script>\s*new I18nBase();\s*</script>##g' "$file"
  sed -i '' -e 's#<script>\s*new I18nCaseDetail();\s*</script>##g' "$file"
done

# 更新test-cases/online-site/目录下的所有HTML文件
for file in test-cases/online-site/*.html; do
  echo "处理文件: $file"
  
  # 替换旧的紧急修复版国际化脚本引用
  sed -i '' -e 's#<script src="../../js/i18n/i18n-emergency-fix.js"></script>#<script type="module" src="../../js/main-new.js"></script>\
    \
    <!-- 紧急修复版国际化脚本（如果模块化系统加载失败会作为备用） -->\
    <script src="../../js/i18n/i18n-emergency-fix-new.js"></script>#g' "$file"
done

# 更新test-cases/tools/目录下的所有HTML文件
for file in test-cases/tools/*.html; do
  echo "处理文件: $file"
  
  # 替换旧的紧急修复版国际化脚本引用
  sed -i '' -e 's#<script src="../../js/i18n/i18n-emergency-fix.js"></script>#<script type="module" src="../../js/main-new.js"></script>\
    \
    <!-- 紧急修复版国际化脚本（如果模块化系统加载失败会作为备用） -->\
    <script src="../../js/i18n/i18n-emergency-fix-new.js"></script>#g' "$file"
done

echo "HTML文件更新完成！" 
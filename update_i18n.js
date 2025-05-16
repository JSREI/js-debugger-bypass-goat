// 批量更新测试用例文件，添加国际化支持
const fs = require('fs');
const path = require('path');

// 项目根目录
const rootDir = __dirname;
// 需要处理的目录
const testCasesDir = path.join(rootDir, 'test-cases');

// 递归扫描所有HTML文件
function scanDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 递归处理子目录
                scanDirectory(fullPath);
            } else if (file.endsWith('.html')) {
                // 处理HTML文件
                updateHTMLFile(fullPath);
            }
        }
    } catch (error) {
        console.error(`扫描目录 ${dir} 时出错:`, error);
    }
}

// 更新HTML文件内容
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;
        
        // 1. 更新标题，加入"Goat"
        content = content.replace(/JavaScript Debugger Bypass/g, 'JavaScript Debugger Bypass Goat');
        content = content.replace(/title>.*? - JavaScript/g, (match) => match.replace(' - JavaScript', ' - JavaScript Debugger Bypass Goat'));
        
        // 2. 添加语言切换器（如果不存在）
        if (!content.includes('lang-switcher-wrapper')) {
            // 找到导航栏的右侧部分
            const navEndIndex = content.indexOf('</div>', content.indexOf('<div class="nav-right"'));
            if (navEndIndex > -1) {
                // 在导航栏的GitHub图标前插入语言切换器
                const beforeGithub = content.substring(0, content.lastIndexOf('<a href="https://github.com', navEndIndex));
                const afterBeforeGithub = content.substring(content.lastIndexOf('<a href="https://github.com', navEndIndex));
                
                const langSwitcherHTML = `
                    <!-- 语言切换器 -->
                    <div id="lang-switcher-wrapper" style="margin: 0 15px;">
                        <div id="lang-switcher" style="display: flex; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
                            <div id="lang-zh" class="lang-option active" data-lang="zh-CN" style="padding: 8px 10px; cursor: pointer; display: flex; align-items: center; background: #4f46e5; color: white;">
                                <i class="ri-check-line" style="margin-right: 4px;"></i>简体中文
                            </div>
                            <div id="lang-en" class="lang-option" data-lang="en-US" style="padding: 8px 10px; cursor: pointer;">
                                English
                            </div>
                        </div>
                    </div>`;
                
                content = beforeGithub + langSwitcherHTML + afterBeforeGithub;
            }
        }
        
        // 3. 添加国际化脚本（如果不存在）
        if (!content.includes('i18n-core.js')) {
            const i18nScripts = `
    <!-- 国际化相关脚本 -->
    <script src="../../js/i18n/zh-CN.js"></script>
    <script src="../../js/i18n/en-US.js"></script>
    <script src="../../js/i18n/i18n-core.js"></script>
    <script src="../../js/i18n/i18n-case-detail.js"></script>
    <script>
        // 初始化国际化
        new I18n();
    </script>
</body>`;
            
            content = content.replace(/<\/body>/, i18nScripts);
        }
        
        // 如果内容有变化，写回文件
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`已更新国际化支持: ${filePath}`);
        } else {
            console.log(`无需更新: ${filePath}`);
        }
    } catch (error) {
        console.error(`更新文件 ${filePath} 时出错:`, error);
    }
}

// 开始扫描
console.log('开始批量添加国际化支持...');
scanDirectory(testCasesDir);
console.log('国际化支持添加完成!'); 
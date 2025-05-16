// 批量更新HTML文件中的标题
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
        
        // 替换标题
        const originalContent = content;
        content = content.replace(/<h1>JS Debugger Bypass<\/h1>/g, '<h1>JS Debugger Bypass Goat</h1>');
        content = content.replace(/<span>JS Debugger Bypass<\/span>/g, '<span>JS Debugger Bypass Goat</span>');
        
        // 如果内容有变化，写回文件
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`已更新: ${filePath}`);
        }
    } catch (error) {
        console.error(`更新文件 ${filePath} 时出错:`, error);
    }
}

// 开始扫描
console.log('开始批量更新标题...');
scanDirectory(testCasesDir);
console.log('标题更新完成!'); 
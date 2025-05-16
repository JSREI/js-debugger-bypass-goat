const fs = require('fs');
const path = require('path');

// Google Analytics 代码
const gaCode = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6205QQM2F7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-6205QQM2F7');
    </script>
`;

// 查找所有需要处理的 HTML 文件
const htmlFiles = [
  // 已经处理过的文件
  // 'index.html',
  // 'cases/index.html',
  
  // 测试用例文件
  'test-cases/execute-debugger-patterns/{}[\'constructor\'](\'debugger\')();.html',
  'test-cases/execute-debugger-patterns/Function.html',
  'test-cases/execute-debugger-patterns/[].constructor.constructor(\'debugger\')().html',
  'test-cases/execute-debugger-patterns/misc.html',
  'test-cases/execute-debugger-patterns/setInterval.html',
  'test-cases/execute-debugger-patterns/{}[\'constructor\'](\'debugger\')());.html',
  'test-cases/execute-debugger-patterns/setInterval-002.html',
  'test-cases/execute-debugger-patterns/eval.html',
  'test-cases/online-site/www.json.cn.html',
  'test-cases/tools/JavaScript Obfuscator Tool.html'
];

// 处理每个文件
htmlFiles.forEach(filePath => {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经包含 Google Analytics 代码
    if (fileContent.includes('G-6205QQM2F7')) {
      console.log(`文件 ${filePath} 已包含 Google Analytics 代码，跳过`);
      return;
    }
    
    // 在 </head> 标签前插入 Google Analytics 代码
    const updatedContent = fileContent.replace('<head>', '<head>' + gaCode);
    
    // 写回文件
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`成功添加 Google Analytics 代码到 ${filePath}`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error.message);
  }
});

console.log('所有文件处理完成'); 
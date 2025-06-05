/**
 * 处理setInterval测试用例的多语言
 */
class I18nIntervalCase extends I18nBase {
    constructor(i18n) {
        super(i18n);
    }
    
    /**
     * 更新测试用例标题
     */
    updateCaseTitle(titleElement) {
        // 判断是基础测试还是高级测试
        const isAdvanced = titleElement.textContent.includes('高级') || titleElement.textContent.includes('Advanced');
        
        if (isAdvanced) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 高级测试' : 'Advanced setInterval Test';
        } else {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 基础测试' : 'Basic setInterval Test';
        }
    }
    
    /**
     * 更新测试用例描述
     */
    updateCaseDescription() {
        const description = document.querySelector('.test-container > p');
        if (!description) return;
        
        // 判断是基础测试还是高级测试
        const testCaseTitle = document.querySelector('.test-container h2');
        const isAdvanced = testCaseTitle.textContent.includes('高级') || testCaseTitle.textContent.includes('Advanced');
        
        if (isAdvanced) {
            description.innerHTML = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用 <code>setInterval</code> 的高级变体执行 debugger 语句的测试用例。此测试使用了字符串拼接和立即执行函数表达式来构造并执行 debugger 语句。'
                : 'This is a test case that uses an advanced variant of <code>setInterval</code> to execute the debugger statement. This test uses string concatenation and immediately invoked function expressions to construct and execute the debugger statement.';
        } else {
            description.innerHTML = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用 <code>setInterval</code> 循环执行 debugger 语句的测试用例。'
                : 'This is a test case that uses <code>setInterval</code> to execute the debugger statement in a loop.';
        }
    }
    
    /**
     * 更新测试指南步骤
     */
    updateGuideSteps() {
        const guideSteps = document.querySelectorAll('.steps-list li');
        if (!guideSteps || guideSteps.length === 0) return;
        
        const steps = [
            this.i18n.currentLang === 'zh-CN' 
                ? '打开浏览器开发者工具（Windows/Linux 按 F12，macOS 按 Command+Option+I，或右键选择"检查"）'
                : 'Open browser developer tools (F12 on Windows/Linux, Command+Option+I on macOS, or right-click and select "Inspect")',
            this.i18n.currentLang === 'zh-CN' 
                ? '点击"开始测试"按钮，页面会自动触发循环的 debugger 断点'
                : 'Click the "Start Test" button, the page will automatically trigger a looping debugger breakpoint',
            this.i18n.currentLang === 'zh-CN' 
                ? '你的目标是：完全绕过这个 debugger 断点，使程序能够立即继续执行'
                : 'Your goal is to: completely bypass this debugger breakpoint, allowing the program to continue executing immediately',
            this.i18n.currentLang === 'zh-CN' 
                ? '由于 setInterval 会周期性执行，这个测试会从执行开始监测 3 秒内是否触发了断点'
                : 'Since setInterval executes periodically, this test will monitor for 3 seconds from execution whether a breakpoint has been triggered',
            this.i18n.currentLang === 'zh-CN' 
                ? '只有当代码能够持续执行（不被任何断点打断）时，才算真正绕过了 debugger'
                : 'Only when the code can execute continuously (without being interrupted by any breakpoint) is the debugger truly bypassed'
        ];
        
        for (let i = 0; i < Math.min(steps.length, guideSteps.length); i++) {
            // 保持原有的格式（比如粗体标签等）
            const step = steps[i];
            if (step.includes('完全绕过') || step.includes('completely bypass')) {
                guideSteps[i].innerHTML = step.replace(/(完全绕过.*执行|completely bypass.*immediately)/g, '<strong>$1</strong>');
            } else {
                guideSteps[i].textContent = step;
            }
        }
    }
    
    /**
     * 更新测试用例页面
     */
    update() {
        // 检查是否在测试用例详情页面
        const testCaseContainer = document.querySelector('.test-container');
        if (!testCaseContainer) return;
        
        try {
            // 创建全局国际化辅助对象和函数
            this.createGlobalI18nHelpers();
            
            // 更新测试用例标题
            const testCaseTitle = document.querySelector('.test-container h2');
            if (testCaseTitle) {
                this.updateCaseTitle(testCaseTitle);
            }
            
            // 更新测试用例描述
            this.updateCaseDescription();
            
            // 更新导航菜单和页脚
            this.updateNavigation();
            
            // 更新测试指南
            this.updateGuideTitle();
            this.updateGuideSteps();
            
            // 更新代码区标签
            this.updateCodeLabel();
            
            // 更新按钮
            this.updateButtons();
            
            // 更新成功和失败消息（setInterval 测试需要特殊处理）
            this.updateResultMessages(true);
            
            // 更新测试用例按钮标签
            this.updateTestCaseButtons();
            
            // 设置动态文本观察器
            this.setupDynamicTextObserver();
        } catch (error) {
            console.error('更新setInterval测试用例多语言时出错:', error);
        }
    }
} 
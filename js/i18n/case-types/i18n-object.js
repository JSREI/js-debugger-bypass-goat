/**
 * 处理对象构造函数测试用例的多语言
 */
class I18nObjectCase extends I18nBase {
    constructor(i18n) {
        super(i18n);
    }
    
    /**
     * 更新测试用例标题
     */
    updateCaseTitle(titleElement) {
        titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? '对象构造函数测试' : 'Object Constructor Test';
    }
    
    /**
     * 更新测试用例描述
     */
    updateCaseDescription() {
        const description = document.querySelector('.test-container > p');
        if (!description) return;
        
        description.textContent = this.i18n.currentLang === 'zh-CN'
            ? '这是一个使用对象的构造函数执行 debugger 语句的测试用例。'
            : 'This is a test case that uses the object constructor to execute the debugger statement.';
    }
    
    /**
     * 更新测试指南步骤
     */
    updateGuideSteps() {
        const guideSteps = document.querySelectorAll('.steps-list li');
        if (!guideSteps || guideSteps.length === 0) return;
        
        const steps = this.i18n.t('testCase.guide.steps');
        
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
            
            // 更新成功和失败消息
            this.updateResultMessages(false);
            
            // 更新测试用例按钮标签
            this.updateTestCaseButtons();
            
            // 设置动态文本观察器
            this.setupDynamicTextObserver();
        } catch (error) {
            console.error('更新对象构造函数测试用例多语言时出错:', error);
        }
    }
} 
/**
 * @deprecated 此文件已弃用，请使用新的模块化系统 
 * 
 * 为保证向下兼容性，此文件仍然可用，但建议使用新的模块化系统
 * 如有任何问题，请参考compat.js中的兼容实现
 */

console.warn('[DEPRECATED] i18n-case-detail.js 已弃用，请使用新的模块化系统');

/**
 * 测试用例详情多语言支持类 (兼容性模式)
 * 
 * 注意：此文件仅作为兼容性保留，建议使用新的模块化结构
 * 新结构查看 js/i18n/i18n-case-processor.js 
 */
class I18nCaseDetail {
    constructor(i18n) {
        console.warn('使用了兼容性的I18nCaseDetail类，建议迁移到新的多语言处理结构');
        
        // 存储i18n实例
        this.i18n = i18n;
        this.ready = false;
        this.updateAttempts = 0; // 记录更新尝试次数
        
        // 检查I18nBase是否已定义
        if (typeof I18nBase === 'undefined') {
            console.error('I18nBase类未定义，尝试加载i18n-base.js');
            this.loadBaseClass().then(() => {
                this.initialize();
            }).catch(error => {
                console.error('无法加载I18nBase:', error);
            });
        } else {
            this.initialize();
        }
    }
    
    /**
     * 加载基础类
     */
    loadBaseClass() {
        return new Promise((resolve, reject) => {
            // 判断I18nBase是否已经存在
            if (typeof I18nBase !== 'undefined') {
                resolve();
                return;
            }
            
            // 动态加载I18nBase
            const script = document.createElement('script');
            script.src = this.getBasePath() + 'i18n-base.js';
            script.onload = () => {
                if (typeof I18nBase !== 'undefined') {
                    resolve();
                } else {
                    reject(new Error('加载了i18n-base.js但I18nBase类仍未定义'));
                }
            };
            script.onerror = () => reject(new Error('无法加载i18n-base.js'));
            document.head.appendChild(script);
        });
    }
    
    /**
     * 获取基础路径
     */
    getBasePath() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/cases/')) {
            return '../js/i18n/';
        } else if (currentPath.includes('/test-cases/')) {
            // 根据嵌套层级调整路径
            const nestingLevel = currentPath.split('/').filter(Boolean).length - 1;
            return '../'.repeat(nestingLevel) + 'js/i18n/';
        }
        
        return 'js/i18n/';
    }
    
    /**
     * 初始化
     */
    initialize() {
        // 检查是否存在新的处理器类
        if (typeof I18nCaseProcessor !== 'undefined') {
            console.log('使用新的I18nCaseProcessor类');
            this.processor = new I18nCaseProcessor(this.i18n);
            this.ready = true;
        } else {
            console.warn('未找到I18nCaseProcessor，尝试加载');
            this.loadCaseProcessor().then(() => {
                if (typeof I18nCaseProcessor !== 'undefined') {
                    this.processor = new I18nCaseProcessor(this.i18n);
                    this.ready = true;
                } else {
                    // 如果仍然找不到，则退回到传统模式
                    console.warn('无法加载I18nCaseProcessor，使用兼容模式');
                    this.useCompatMode();
                }
            }).catch(() => {
                this.useCompatMode();
            });
        }
    }
    
    /**
     * 加载新的处理器类
     */
    loadCaseProcessor() {
        return new Promise((resolve, reject) => {
            // 判断I18nCaseProcessor是否已经存在
            if (typeof I18nCaseProcessor !== 'undefined') {
                resolve();
                return;
            }
            
            // 防止重复加载
            const existingScript = document.querySelector('script[src*="i18n-case-processor.js"]');
            if (existingScript) {
                // 已有加载中的脚本，等待其完成
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', () => reject(new Error('现有的i18n-case-processor.js加载失败')));
                return;
            }
            
            // 动态加载I18nCaseProcessor
            const script = document.createElement('script');
            script.src = this.getBasePath() + 'i18n-case-processor.js';
            script.onload = () => {
                if (typeof I18nCaseProcessor !== 'undefined') {
                    resolve();
                } else {
                    reject(new Error('加载了i18n-case-processor.js但I18nCaseProcessor类仍未定义'));
                }
            };
            script.onerror = () => reject(new Error('无法加载i18n-case-processor.js'));
            document.head.appendChild(script);
        });
    }
    
    /**
     * 使用兼容模式
     * 这部分代码基于I18nBase实现旧版本逻辑
     */
    useCompatMode() {
        console.warn('启用完全兼容模式');
        
        // 确保I18nBase存在
        if (typeof I18nBase === 'undefined') {
            console.error('无法启用兼容模式：I18nBase未定义');
            return;
        }
        
        // 创建I18nBase实例来处理基础功能
        this.baseInstance = new I18nBase(this.i18n);
        
        // 创建方法代理到baseInstance
        this.inheritBaseMethod('updateNavigation');
        this.inheritBaseMethod('updateCodeLabel');
        this.inheritBaseMethod('updateButtons');
        this.inheritBaseMethod('updateGuideTitle');
        this.inheritBaseMethod('createGlobalI18nHelpers');
        this.inheritBaseMethod('setupDynamicTextObserver');
        this.inheritBaseMethod('updateResultMessages');
        this.inheritBaseMethod('updateTestCaseButtons');
        
        this.ready = true;
    }
    
    /**
     * 从baseInstance继承方法
     */
    inheritBaseMethod(methodName) {
        if (!this.baseInstance) return;
        
        if (typeof this.baseInstance[methodName] === 'function') {
            this[methodName] = (...args) => {
                return this.baseInstance[methodName](...args);
            };
        }
    }
    
    /**
     * 更新测试用例标题
     */
    updateCaseTitle(titleElement) {
        // 防御性检查
        if (!this.i18n || typeof this.i18n.t !== 'function') {
            console.warn('i18n实例尚未准备好，无法更新测试用例标题');
            return;
        }
        
        if (this.processor) {
            // 新版处理方式：使用数据属性
            titleElement.setAttribute('data-i18n', this.getTitleKey(titleElement.textContent.trim()));
            return;
        }
        
        // 兼容模式实现
        const titleText = titleElement.textContent.trim();
        
        try {
            if (titleText.includes('eval')) {
                titleElement.textContent = this.i18n.t('testCase.eval.title');
            } 
            else if (titleText.includes('Function')) {
                titleElement.textContent = this.i18n.t('testCase.function.title');
            }
            else if (titleText.includes('setInterval') && titleText.includes('基础')) {
                titleElement.textContent = this.i18n.t('testCase.interval.basic.title');
            }
            else if (titleText.includes('setInterval') && titleText.includes('高级')) {
                titleElement.textContent = this.i18n.t('testCase.interval.advanced.title');
            }
            else if (titleText.includes('数组')) {
                titleElement.textContent = this.i18n.t('testCase.array.title');
            }
            else if (titleText.includes('对象')) {
                titleElement.textContent = this.i18n.t('testCase.object.title');
            }
            else if (titleText.includes('其他')) {
                titleElement.textContent = this.i18n.t('testCase.other.title');
            }
        } catch (error) {
            console.error('更新测试用例标题失败:', error);
        }
    }
    
    /**
     * 获取标题翻译键
     */
    getTitleKey(titleText) {
        if (titleText.includes('eval')) {
            return 'testCase.eval.title';
        } 
        else if (titleText.includes('Function')) {
            return 'testCase.function.title';
        }
        else if (titleText.includes('setInterval') && titleText.includes('基础')) {
            return 'testCase.interval.basic.title';
        }
        else if (titleText.includes('setInterval') && titleText.includes('高级')) {
            return 'testCase.interval.advanced.title';
        }
        else if (titleText.includes('数组') || titleText.includes('Array')) {
            return 'testCase.array.title';
        }
        else if (titleText.includes('对象') || titleText.includes('Object')) {
            return 'testCase.object.title';
        }
        else if (titleText.includes('其他') || titleText.includes('Other')) {
            return 'testCase.other.title';
        }
        return '';
    }
    
    /**
     * 更新测试用例描述
     */
    updateCaseDescription() {
        // 防御性检查
        if (!this.i18n || typeof this.i18n.t !== 'function') {
            console.warn('i18n实例尚未准备好，无法更新测试用例描述');
            return;
        }
        
        // 如果已经有新处理器，让它处理
        if (this.processor) {
            return;
        }
        
        // 否则使用兼容模式
        const description = document.querySelector('.test-container > p');
        if (!description) return;
        
        try {
            const titleElement = document.querySelector('.test-container h2');
            if (!titleElement) return;
            
            const titleText = titleElement.textContent.trim();
            
            if (titleText.includes('eval')) {
                description.textContent = this.i18n.t('testCase.eval.description');
            } 
            else if (titleText.includes('Function')) {
                description.textContent = this.i18n.t('testCase.function.description');
            }
            else if (titleText.includes('setInterval') && (titleText.includes('基础') || titleText.includes('Basic'))) {
                description.innerHTML = this.i18n.t('testCase.interval.basic.description');
            }
            else if (titleText.includes('setInterval') && (titleText.includes('高级') || titleText.includes('Advanced'))) {
                description.innerHTML = this.i18n.t('testCase.interval.advanced.description');
            }
            else if (titleText.includes('数组') || titleText.includes('Array')) {
                description.textContent = this.i18n.t('testCase.array.description');
            }
            else if (titleText.includes('对象') || titleText.includes('Object')) {
                description.textContent = this.i18n.t('testCase.object.description');
            }
            else if (titleText.includes('其他') || titleText.includes('Other')) {
                description.textContent = this.i18n.t('testCase.other.description');
            }
        } catch (error) {
            console.error('更新测试用例描述失败:', error);
        }
    }
    
    /**
     * 更新测试指南步骤
     */
    updateGuideSteps() {
        // 防御性检查
        if (!this.i18n) {
            console.warn('i18n实例尚未准备好，无法更新测试指南步骤');
            return;
        }
        
        // 如果已经有新处理器，让它处理
        if (this.processor) {
            return;
        }
        
        try {
            // 否则使用兼容模式
            const guideSteps = document.querySelectorAll('.steps-list li');
            if (!guideSteps || guideSteps.length === 0) return;
            
            // 根据页面内容判断是普通测试还是setInterval测试
            const titleElement = document.querySelector('.test-container h2');
            if (!titleElement) return;
            
            const isIntervalTest = titleElement.textContent.includes('setInterval');
            
            // 使用适当的步骤文本
            const steps = isIntervalTest 
                ? [
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
                ]
                : (this.i18n.t ? this.i18n.t('testCase.guide.steps') : []);
            
            for (let i = 0; i < Math.min(steps.length, guideSteps.length); i++) {
                // 保持原有的格式（比如粗体标签等）
                const step = steps[i];
                if (!step) continue;
                
                if (step.includes('完全绕过') || step.includes('completely bypass')) {
                    guideSteps[i].innerHTML = step.replace(/(完全绕过.*执行|completely bypass.*immediately)/g, '<strong>$1</strong>');
                } else {
                    guideSteps[i].textContent = step;
                }
            }
        } catch (error) {
            console.error('更新测试指南步骤失败:', error);
        }
    }
    
    /**
     * 替换JavaScript中的硬编码中文文本
     */
    patchJavaScriptTexts() {
        try {
            // 如果已经有新处理器，让它处理
            if (this.processor) {
                return;
            }
            
            // 防御性检查
            if (!this.baseInstance) {
                console.warn('baseInstance尚未准备好，无法替换JavaScript文本');
                return;
            }
            
            // 否则使用兼容模式
            // 创建全局国际化辅助对象和函数
            this.createGlobalI18nHelpers();
            
            // 设置动态文本观察器
            this.setupDynamicTextObserver();
        } catch (error) {
            console.error('多语言替换JS文本时出错，但不影响主要功能:', error);
        }
    }
    
    /**
     * 更新测试用例页面
     */
    update() {
        // 如果尚未准备好，则记录并停止执行
        // 防止无限循环递归调用
        if (!this.ready) {
            this.updateAttempts++;
            // 最多尝试5次，避免无限循环
            if (this.updateAttempts <= 5) {
                console.log(`I18nCaseDetail尚未准备好，尝试次数: ${this.updateAttempts}`);
                // 使用一次性的延迟调用，不在回调中递归
                setTimeout(() => {
                    // 检查i18n实例和baseInstance是否已准备好
                    if (this.i18n && (typeof I18nBase !== 'undefined')) {
                        // 尝试初始化基础实例
                        if (!this.baseInstance && typeof I18nBase === 'function') {
                            try {
                                this.baseInstance = new I18nBase(this.i18n);
                                this.ready = true;
                            } catch (e) {
                                console.error('创建baseInstance失败:', e);
                            }
                        }
                    }
                }, 200 * this.updateAttempts); // 增加延迟时间，避免过于频繁的尝试
            } else {
                console.error('I18nCaseDetail初始化失败，放弃更新');
            }
            return;
        }

        // 检查是否在测试用例详情页面
        const testCaseContainer = document.querySelector('.test-container');
        if (!testCaseContainer) return;
        
        try {
            // 如果已经有新处理器，让它处理
            if (this.processor) {
                // 旧版直接调用translate可能有问题，不推荐
                return;
            }
            
            // 防御性检查
            if (!this.i18n || !this.baseInstance) {
                console.warn('i18n实例或baseInstance尚未准备好，无法更新页面');
                return;
            }
            
            // 否则使用兼容模式
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
            if (this.baseInstance) {
                // 判断测试类型
                const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
                this.updateResultMessages(isIntervalTest);
            }
            
            // 更新测试用例按钮标签
            this.updateTestCaseButtons();
            
            // 强制替换所有JavaScript中的硬编码状态文本
            try {
                this.patchJavaScriptTexts();
            } catch (error) {
                console.error('多语言替换JS文本时出错，但不影响主要功能:', error);
            }
            
            // 在DOM加载完成后动态处理"测试完成"的显示
            setTimeout(() => {
                const resultMessage = document.querySelector('.result-message');
                if (resultMessage) {
                    if (this.baseInstance) {
                        // 判断测试类型
                        const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
                        this.updateResultMessages(isIntervalTest);
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('兼容性I18nCaseDetail更新页面时出错:', error);
        }
    }
} 
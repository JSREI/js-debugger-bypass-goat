/**
 * 简化版测试用例多语言处理器
 * 使用声明式绑定方式处理测试用例页面
 */
class I18nCaseProcessor {
    constructor(i18n) {
        this.i18n = i18n;
        this.init();
    }
    
    /**
     * 初始化处理器
     */
    init() {
        // 检查是否在测试用例详情页面
        if (!document.querySelector('.test-container')) {
            return;
        }
        
        // 创建全局国际化辅助对象
        this.createGlobalI18nHelpers();
        
        // 添加必要的数据属性
        this.setupDataAttributes();
        
        // 执行初始化翻译
        this.translate();
        
        // 监听动态内容
        this.setupDynamicContentHandling();
    }
    
    /**
     * 创建全局国际化辅助对象
     */
    createGlobalI18nHelpers() {
        const currentLang = this.i18n.currentLang;
        
        // 创建全局翻译对象，用于JS中动态获取翻译
        if (!window.I18N_STRINGS) {
            window.I18N_STRINGS = {
                'zh-CN': {
                    'testRunning': '测试运行中...',
                    'testComplete': '测试完成',
                    'startTest': '开始测试',
                    'stopTest': '停止测试',
                    'noPauses': '测试期间未检测到任何断点暂停。',
                    'interrupted': '测试期间检测到执行被断点中断。',
                    'success': '🎉 恭喜！你已成功绕过 debugger 断点！',
                    'failure': '❌ 未能完全绕过 debugger 断点'
                },
                'en-US': {
                    'testRunning': 'Test Running...',
                    'testComplete': 'Test Complete',
                    'startTest': 'Start Test',
                    'stopTest': 'Stop Test',
                    'noPauses': 'No breakpoint pauses detected during the test.',
                    'interrupted': 'Execution was interrupted by a breakpoint during the test.',
                    'success': '🎉 Congratulations! You have successfully bypassed the debugger breakpoint!',
                    'failure': '❌ Failed to completely bypass the debugger breakpoint'
                }
            };
            
            // 添加全局帮助函数
            window.i18n = function(key) {
                const lang = window.currentLang || 'zh-CN';
                return window.I18N_STRINGS[lang][key] || key;
            };
        }
        
        // 确保currentLang在全局可用
        window.currentLang = currentLang;
    }
    
    /**
     * 设置声明式数据属性
     * 为需要国际化的元素添加data-i18n等属性
     */
    setupDataAttributes() {
        try {
            // 处理测试用例标题
            const titleElement = document.querySelector('.test-container h2');
            if (titleElement) {
                // 根据标题内容确定测试类型
                const title = titleElement.textContent.trim();
                let titleKey = '';
                
                if (title.includes('eval')) {
                    titleKey = 'testCase.eval.title';
                } 
                else if (title.includes('Function')) {
                    titleKey = 'testCase.function.title';
                }
                else if (title.includes('setInterval') && title.includes('基础')) {
                    titleKey = 'testCase.interval.basic.title';
                }
                else if (title.includes('setInterval') && title.includes('高级')) {
                    titleKey = 'testCase.interval.advanced.title';
                }
                else if (title.includes('数组') || title.includes('Array')) {
                    titleKey = 'testCase.array.title';
                }
                else if (title.includes('对象') || title.includes('Object')) {
                    titleKey = 'testCase.object.title';
                }
                else if (title.includes('其他') || title.includes('Other')) {
                    titleKey = 'testCase.other.title';
                }
                
                if (titleKey) {
                    titleElement.setAttribute('data-i18n', titleKey);
                }
            }
            
            // 处理测试用例描述
            const descElement = document.querySelector('.test-container > p');
            if (descElement) {
                // 根据标题确定描述类型
                const title = document.querySelector('.test-container h2').textContent.trim();
                let descKey = '';
                
                if (title.includes('eval')) {
                    descKey = 'testCase.eval.description';
                } 
                else if (title.includes('Function')) {
                    descKey = 'testCase.function.description';
                }
                else if (title.includes('setInterval') && (title.includes('基础') || title.includes('Basic'))) {
                    descKey = 'testCase.interval.basic.description';
                    descElement.setAttribute('data-i18n-html', descKey); // 使用HTML翻译，因为包含code标签
                    
                    // 已设置HTML翻译，跳过后续的textContent翻译
                    descElement = null;
                }
                else if (title.includes('setInterval') && (title.includes('高级') || title.includes('Advanced'))) {
                    descKey = 'testCase.interval.advanced.description';
                    descElement.setAttribute('data-i18n-html', descKey); // 使用HTML翻译，因为包含code标签
                    
                    // 已设置HTML翻译，跳过后续的textContent翻译
                    descElement = null;
                }
                else if (title.includes('数组') || title.includes('Array')) {
                    descKey = 'testCase.array.description';
                }
                else if (title.includes('对象') || title.includes('Object')) {
                    descKey = 'testCase.object.description';
                }
                else if (title.includes('其他') || title.includes('Other')) {
                    descKey = 'testCase.other.description';
                }
                
                if (descKey && descElement) {
                    descElement.setAttribute('data-i18n', descKey);
                }
            }
            
            // 处理测试指南标题
            const guideTitle = document.querySelector('.guide-steps h3');
            if (guideTitle) {
                guideTitle.setAttribute('data-i18n', 'testCase.guide.title');
            }
            
            // 处理测试指南步骤
            const guideSteps = document.querySelectorAll('.steps-list li');
            if (guideSteps && guideSteps.length > 0) {
                // 判断是否为setInterval测试
                const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
                
                if (isIntervalTest) {
                    // setInterval测试步骤
                    const stepKeys = [
                        'testCase.guide.interval.step1',
                        'testCase.guide.interval.step2',
                        'testCase.guide.interval.step3',
                        'testCase.guide.interval.step4',
                        'testCase.guide.interval.step5'
                    ];
                    
                    for (let i = 0; i < Math.min(stepKeys.length, guideSteps.length); i++) {
                        guideSteps[i].setAttribute('data-i18n-html', stepKeys[i]);
                    }
                } else {
                    // 一般测试步骤
                    const stepKeys = [
                        'testCase.guide.steps.step1',
                        'testCase.guide.steps.step2',
                        'testCase.guide.steps.step3',
                        'testCase.guide.steps.step4',
                        'testCase.guide.steps.step5'
                    ];
                    
                    for (let i = 0; i < Math.min(stepKeys.length, guideSteps.length); i++) {
                        guideSteps[i].setAttribute('data-i18n-html', stepKeys[i]);
                    }
                }
            }
            
            // 处理代码区标签
            const codeBlock = document.querySelector('.code-block');
            if (codeBlock) {
                // 使用CSS自定义属性而不是content，因为content不能通过CSS变量动态设置
                document.documentElement.style.setProperty(
                    '--code-block-label',
                    `"${this.i18n.t('testCase.codeLabel')}"`
                );
                
                // 添加样式以使用CSS自定义属性
                const style = document.createElement('style');
                style.textContent = `
                    .code-block::before { 
                        content: var(--code-block-label) !important; 
                        position: absolute;
                        top: -12px;
                        left: 1rem;
                        background: var(--primary-color);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 12px;
                        font-size: 0.875rem;
                    }
                `;
                
                // 检查是否已经添加过样式
                const existingStyle = document.querySelector('style[data-i18n-code-label]');
                if (existingStyle) {
                    existingStyle.textContent = style.textContent;
                } else {
                    style.setAttribute('data-i18n-code-label', 'true');
                    document.head.appendChild(style);
                }
            }
            
            // 处理按钮
            const testButton = document.getElementById('testButton');
            if (testButton) {
                testButton.setAttribute('data-i18n', 'testCase.startTest');
            }
            
            const stopButton = document.getElementById('stopButton');
            if (stopButton) {
                stopButton.setAttribute('data-i18n', 'testCase.stopTest');
            }
            
            // 处理测试状态
            const testStatus = document.getElementById('testStatus');
            if (testStatus) {
                // 初始化时不设置属性，在动态处理中根据内容设置
            }
            
            // 处理测试结果消息
            const successMsg = document.querySelector('#success');
            if (successMsg) {
                // 消息标题
                const titleElement = successMsg.querySelector('.details') ? 
                    successMsg.firstChild : successMsg;
                
                if (titleElement) {
                    titleElement.parentNode.insertBefore(
                        document.createElement('span'), 
                        titleElement
                    ).setAttribute('data-i18n', 'testCase.success.title');
                    
                    titleElement.remove();
                }
                
                // 消息详情
                const detailsElement = successMsg.querySelector('.details');
                if (detailsElement) {
                    // 判断是否为setInterval测试
                    const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
                    
                    if (isIntervalTest) {
                        detailsElement.setAttribute('data-i18n', 'testCase.success.detail.interval');
                    } else {
                        // 保留execTime span
                        const execTimeSpan = detailsElement.querySelector('#execTime');
                        
                        if (execTimeSpan) {
                            // 使用HTML模式以保留span
                            detailsElement.setAttribute('data-i18n-html', 'testCase.success.detail');
                            
                            // 设置插值参数
                            detailsElement.setAttribute('data-i18n-params', JSON.stringify({
                                time: `<span id="execTime">${execTimeSpan.textContent}</span>`
                            }));
                        } else {
                            detailsElement.setAttribute('data-i18n', 'testCase.success.detail');
                        }
                    }
                }
            }
            
            // 处理失败消息
            const failureMsg = document.querySelector('#failure');
            if (failureMsg) {
                // 消息标题
                const titleElement = failureMsg.querySelector('.details') ? 
                    failureMsg.firstChild : failureMsg;
                
                if (titleElement) {
                    titleElement.parentNode.insertBefore(
                        document.createElement('span'), 
                        titleElement
                    ).setAttribute('data-i18n', 'testCase.failure.title');
                    
                    titleElement.remove();
                }
                
                // 消息详情
                const detailsElement = failureMsg.querySelector('.details');
                if (detailsElement) {
                    // 判断是否为setInterval测试
                    const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
                    
                    if (isIntervalTest) {
                        detailsElement.setAttribute('data-i18n', 'testCase.failure.detail.interval');
                    } else {
                        // 保留execTime span
                        const execTimeSpan = detailsElement.querySelector('#execTimeFailure');
                        
                        if (execTimeSpan) {
                            // 使用HTML模式以保留span
                            detailsElement.setAttribute('data-i18n-html', 'testCase.failure.detail');
                            
                            // 设置插值参数
                            detailsElement.setAttribute('data-i18n-params', JSON.stringify({
                                time: `<span id="execTimeFailure">${execTimeSpan.textContent}</span>`
                            }));
                        } else {
                            detailsElement.setAttribute('data-i18n', 'testCase.failure.detail');
                        }
                    }
                }
            }
            
            // 处理测试用例按钮标签
            const testButtons = document.querySelectorAll('.case-badge');
            if (testButtons && testButtons.length > 0) {
                testButtons.forEach(button => {
                    const buttonText = button.textContent.trim();
                    
                    if (buttonText.includes('基础测试') || buttonText.includes('Basic Test')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.basic');
                    }
                    else if (buttonText.includes('定时器') || buttonText.includes('Timer')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.timer');
                    }
                    else if (buttonText.includes('构造函数') || buttonText.includes('Constructor')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.constructor');
                    }
                    else if (buttonText.includes('在线网站') || buttonText.includes('Online Site')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.online');
                    }
                    else if (buttonText.includes('工具网站') || buttonText.includes('Tool Site')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.tools');
                    }
                    else if (buttonText.includes('其他') || buttonText.includes('Other')) {
                        button.setAttribute('data-i18n', 'casesPage.categories.other');
                    }
                    
                    // 保留图标
                    const iconElement = button.querySelector('i');
                    if (iconElement) {
                        button.innerHTML = '';
                        button.appendChild(iconElement);
                        
                        // 创建文本容器
                        const span = document.createElement('span');
                        span.setAttribute('data-i18n', button.getAttribute('data-i18n'));
                        button.appendChild(span);
                        
                        // 从按钮移除属性，因为现在span有属性了
                        button.removeAttribute('data-i18n');
                    }
                });
            }
            
        } catch (error) {
            console.error('设置data-i18n属性时出错:', error);
        }
    }
    
    /**
     * 执行翻译
     */
    translate() {
        // 调用i18n实例的翻译方法
        this.i18n.translatePage();
    }
    
    /**
     * 设置动态内容处理
     */
    setupDynamicContentHandling() {
        // 监听测试状态变化
        const testStatus = document.getElementById('testStatus');
        if (testStatus) {
            // 创建一个观察器来监视文本内容变化
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        const newText = testStatus.textContent.trim();
                        
                        if (newText.includes('测试运行中') || newText.includes('Test Running')) {
                            testStatus.textContent = this.i18n.t('testCase.testRunning');
                        }
                        else if (newText.includes('测试完成') || newText.includes('Test Complete')) {
                            testStatus.textContent = this.i18n.t('testCase.testComplete');
                        }
                    }
                });
            });
            
            observer.observe(testStatus, { 
                characterData: true, 
                childList: true,
                subtree: true
            });
        }
        
        // 处理执行时间更新
        const handleExecTimeUpdate = () => {
            const execTime = document.getElementById('execTime');
            const execTimeFailure = document.getElementById('execTimeFailure');
            
            if (execTime) {
                const container = execTime.closest('[data-i18n-params]');
                if (container) {
                    try {
                        const params = JSON.parse(container.getAttribute('data-i18n-params'));
                        params.time = `<span id="execTime">${execTime.textContent}</span>`;
                        container.setAttribute('data-i18n-params', JSON.stringify(params));
                    } catch (error) {
                        console.error('更新execTime参数时出错:', error);
                    }
                }
            }
            
            if (execTimeFailure) {
                const container = execTimeFailure.closest('[data-i18n-params]');
                if (container) {
                    try {
                        const params = JSON.parse(container.getAttribute('data-i18n-params'));
                        params.time = `<span id="execTimeFailure">${execTimeFailure.textContent}</span>`;
                        container.setAttribute('data-i18n-params', JSON.stringify(params));
                    } catch (error) {
                        console.error('更新execTimeFailure参数时出错:', error);
                    }
                }
            }
        };
        
        // 每100毫秒检查一次执行时间
        setInterval(handleExecTimeUpdate, 100);
    }
}

// 创建全局实例，用于其他模块引用
document.addEventListener('DOMContentLoaded', () => {
    if (window.i18nInstance) {
        window.i18nCaseProcessor = new I18nCaseProcessor(window.i18nInstance);
    }
}); 
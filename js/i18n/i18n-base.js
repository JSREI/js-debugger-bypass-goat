/**
 * @deprecated 此文件已弃用，请使用新的模块化系统 
 * 
 * 为保证向下兼容性，此文件仍然可用，但建议使用新的模块化系统
 * 如有任何问题，请参考compat.js中的兼容实现
 */

console.warn('[DEPRECATED] i18n-base.js 已弃用，请使用新的模块化系统');

/**
 * 基础多语言处理类
 * 提供通用的多语言实现方法
 */
class I18nBase {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    /**
     * 更新导航菜单中的文本
     */
    updateNavigation() {
        // 处理顶部导航链接
        const homeLink = document.querySelector('a[href="../../index.html"]');
        if (homeLink) {
            const icon = homeLink.querySelector('i');
            homeLink.innerHTML = '';
            if (icon) homeLink.appendChild(icon);
            homeLink.appendChild(document.createTextNode(' ' + this.i18n.t('nav.home')));
        }
        
        const casesLink = document.querySelector('a[href="../../cases/index.html"]');
        if (casesLink) {
            const icon = casesLink.querySelector('i');
            casesLink.innerHTML = '';
            if (icon) casesLink.appendChild(icon);
            casesLink.appendChild(document.createTextNode(' ' + this.i18n.t('nav.testCases')));
        }
        
        // 处理页脚"问题反馈"链接
        const feedbackLink = document.querySelector('.footer-links a[href*="issues"]');
        if (feedbackLink) {
            const icon = feedbackLink.querySelector('i');
            feedbackLink.innerHTML = '';
            if (icon) feedbackLink.appendChild(icon);
            feedbackLink.appendChild(document.createTextNode(' ' + this.i18n.t('footer.feedback')));
        }
    }
    
    /**
     * 更新代码区标签
     */
    updateCodeLabel() {
        const codeBlock = document.querySelector('.code-block');
        if (!codeBlock) return;
        
        // 创建完整的样式覆盖，强制覆盖原有的content属性值
        const style = document.createElement('style');
        style.textContent = `
            .code-block::before { 
                content: "${this.i18n.t('testCase.codeLabel')}" !important; 
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
    
    /**
     * 更新按钮和状态文本
     */
    updateButtons() {
        const testButton = document.getElementById('testButton');
        if (testButton) testButton.textContent = this.i18n.t('testCase.startTest');
        
        const stopButton = document.getElementById('stopButton');
        if (stopButton) {
            stopButton.textContent = this.i18n.currentLang === 'zh-CN' ? '停止测试' : 'Stop Test';
        }
        
        // 更新"测试运行中..."和"测试完成"文本
        const testStatus = document.getElementById('testStatus');
        if (testStatus && testStatus.textContent.includes('测试运行中')) {
            testStatus.textContent = this.i18n.t('testCase.testRunning');
        } else if (testStatus && testStatus.textContent.includes('测试完成')) {
            testStatus.textContent = this.i18n.t('testCase.testComplete');
        }
    }
    
    /**
     * 更新测试指南标题
     */
    updateGuideTitle() {
        const guideTitle = document.querySelector('.guide-steps h3');
        if (!guideTitle) return;
        
        const icon = guideTitle.querySelector('i');
        guideTitle.innerHTML = '';
        if (icon) guideTitle.appendChild(icon);
        guideTitle.appendChild(document.createTextNode(' ' + this.i18n.t('testCase.guide.title')));
    }
    
    /**
     * 创建全局国际化辅助对象和函数
     */
    createGlobalI18nHelpers() {
        const currentLang = this.i18n.currentLang;
        
        // 创建一个全局翻译对象
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
        const globalScript = document.createElement('script');
        globalScript.textContent = `window.currentLang = "${currentLang}";`;
        document.head.appendChild(globalScript);
    }
    
    /**
     * 创建DOM变化观察器，处理动态生成的文本
     */
    setupDynamicTextObserver() {
        // 使用更安全的备用方法：全局翻译对象替换硬编码文本
        // 查找动态生成的文本元素并替换内容
        const updateTextNode = (node) => {
            try {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    // 替换常见状态文本
                    if (text.includes('测试运行中...') || text.includes('Test Running...')) {
                        node.textContent = window.i18n('testRunning');
                    }
                    else if (text.includes('测试完成') || text.includes('Test Complete')) {
                        node.textContent = window.i18n('testComplete');
                    }
                    else if (text.includes('开始测试') || text.includes('Start Test')) {
                        node.textContent = window.i18n('startTest');
                    }
                    else if (text.includes('停止测试') || text.includes('Stop Test')) {
                        node.textContent = window.i18n('stopTest');
                    }
                    else if (text.includes('测试期间未检测到任何断点暂停') || 
                             text.includes('No breakpoint pauses detected')) {
                        node.textContent = window.i18n('noPauses');
                    }
                    else if (text.includes('测试期间检测到执行被断点中断') || 
                             text.includes('Execution was interrupted')) {
                        node.textContent = window.i18n('interrupted');
                    }
                    else if (text.includes('恭喜！你已成功绕过 debugger 断点') || 
                             text.includes('Congratulations! You have successfully bypassed')) {
                        node.textContent = window.i18n('success');
                    }
                    else if (text.includes('未能完全绕过 debugger 断点') || 
                             text.includes('Failed to completely bypass')) {
                        node.textContent = window.i18n('failure');
                    }
                }
                else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.childNodes.forEach(updateTextNode);
                }
            } catch (error) {
                console.error('处理文本节点时出错:', error);
            }
        };
        
        // 监听DOM变化，处理动态添加的内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                try {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(updateTextNode);
                    }
                    else if (mutation.type === 'characterData') {
                        updateTextNode(mutation.target);
                    }
                } catch (error) {
                    console.error('DOM变化处理出错:', error);
                }
            });
        });
        
        // 开始监听DOM变化
        try {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                characterData: true 
            });
        } catch (error) {
            console.error('无法启动DOM观察器:', error);
        }
        
        // 立即处理当前DOM中的文本
        updateTextNode(document.body);
    }
    
    /**
     * 更新测试结果消息
     */
    updateResultMessages(isIntervalTest = false) {
        // 更新成功消息
        const successMsg = document.querySelector('#success');
        if (successMsg) {
            const successTitle = this.i18n.t('testCase.success.title');
            const successDetail = isIntervalTest
                ? (this.i18n.currentLang === 'zh-CN' ? '测试期间未检测到任何断点暂停。' : 'No breakpoint pauses detected during the test.')
                : this.i18n.t('testCase.success.detail').replace('{time}', '<span id="execTime">0</span>');
            
            // 检查是否已经更新过
            if (!successMsg.getAttribute('data-i18n-updated') || successMsg.getAttribute('data-i18n-updated') !== this.i18n.currentLang) {
                successMsg.innerHTML = '';
                successMsg.appendChild(document.createTextNode(successTitle));
                
                const newDetails = document.createElement('div');
                newDetails.className = 'details';
                
                if (isIntervalTest) {
                    newDetails.textContent = successDetail;
                } else {
                    newDetails.id = 'execTimeContainer';
                    newDetails.innerHTML = successDetail;
                }
                
                successMsg.appendChild(newDetails);
                successMsg.setAttribute('data-i18n-updated', this.i18n.currentLang);
            }
        }
        
        // 更新失败消息
        const failureMsg = document.querySelector('#failure');
        if (failureMsg) {
            const failureTitle = this.i18n.t('testCase.failure.title');
            const failureDetail = isIntervalTest
                ? (this.i18n.currentLang === 'zh-CN' ? '测试期间检测到执行被断点中断。' : 'Execution was interrupted by a breakpoint during the test.')
                : this.i18n.t('testCase.failure.detail').replace('{time}', '<span id="execTimeFailure">0</span>');
            
            // 检查是否已经更新过
            if (!failureMsg.getAttribute('data-i18n-updated') || failureMsg.getAttribute('data-i18n-updated') !== this.i18n.currentLang) {
                failureMsg.innerHTML = '';
                failureMsg.appendChild(document.createTextNode(failureTitle));
                
                const newDetails = document.createElement('div');
                newDetails.className = 'details';
                
                if (isIntervalTest) {
                    newDetails.textContent = failureDetail;
                } else {
                    newDetails.id = 'execTimeFailureContainer';
                    newDetails.innerHTML = failureDetail;
                }
                
                failureMsg.appendChild(newDetails);
                failureMsg.setAttribute('data-i18n-updated', this.i18n.currentLang);
            }
        }
    }
    
    /**
     * 更新测试用例按钮标签
     */
    updateTestCaseButtons() {
        // 查找所有测试按钮
        const testButtons = document.querySelectorAll('.case-badge');
        if (!testButtons || testButtons.length === 0) return;
        
        testButtons.forEach(button => {
            const buttonText = button.textContent.trim();
            const iconElement = button.querySelector('i');
            
            if (buttonText.includes('基础测试') || buttonText.includes('Basic Test')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '基础测试' : 'Basic Test'));
            }
            else if (buttonText.includes('定时器') || buttonText.includes('Timer')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '定时器' : 'Timer'));
            }
            else if (buttonText.includes('构造函数') || buttonText.includes('Constructor')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '构造函数' : 'Constructor'));
            }
            else if (buttonText.includes('在线网站') || buttonText.includes('Online Site')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '在线网站' : 'Online Site'));
            }
            else if (buttonText.includes('工具网站') || buttonText.includes('Tool Site')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '工具网站' : 'Tool Site'));
            }
            else if (buttonText.includes('其他') || buttonText.includes('Other')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '其他' : 'Other'));
            }
        });
    }
} 
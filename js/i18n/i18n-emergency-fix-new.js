/**
 * 紧急修复版国际化处理 - 新模块化版本
 * 使用新的模块化结构，但提供与旧版本兼容的API
 */
(function() {
    console.log('== 紧急修复版国际化系统启动(新版) ==');
    
    // 防止重复初始化
    if (window.emergencyI18nInitialized) {
        console.log('紧急修复版国际化系统已初始化，跳过');
        return;
    }
    window.emergencyI18nInitialized = true;

    // 基本翻译资源 - 用于在动态加载资源前提供基本翻译
    const fallbackTranslations = {
        'zh-CN': {
            'title': 'JavaScript Debugger Bypass Goat',
            'nav.home': '首页',
            'nav.testCases': '测试用例',
            'footer.feedback': '问题反馈',
            'testCase.codeLabel': '测试代码',
            'testCase.startTest': '开始测试',
            'testCase.stopTest': '停止测试',
            'testCase.testRunning': '测试运行中...',
            'testCase.testComplete': '测试完成',
            'common.copyCode': '复制代码',
            'common.copied': '已复制！'
        },
        'en-US': {
            'title': 'JavaScript Debugger Bypass Goat',
            'nav.home': 'Home',
            'nav.testCases': 'Test Cases',
            'footer.feedback': 'Feedback',
            'testCase.codeLabel': 'Test Code',
            'testCase.startTest': 'Start Test',
            'testCase.stopTest': 'Stop Test',
            'testCase.testRunning': 'Test Running...',
            'testCase.testComplete': 'Test Complete',
            'common.copyCode': 'Copy Code',
            'common.copied': 'Copied!'
        }
    };

    // 获取当前语言
    function getCurrentLang() {
        try {
            const savedLang = localStorage.getItem('locale');
            if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
                return savedLang;
            }
        } catch (e) {
            console.error('读取语言设置失败:', e);
        }
        
        // 默认使用浏览器语言或中文
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
    }

    /**
     * 翻译函数
     * @param {string} key - 翻译键
     * @param {Object} params - 插值参数
     * @returns {string} - 翻译结果
     */
    function translate(key, params = {}) {
        // 1. 尝试使用新模块化系统翻译
        if (window.i18n && typeof window.i18n.translate === 'function') {
            return window.i18n.translate(key, params);
        }

        // 2. 使用fallback翻译资源
        const lang = getCurrentLang();
        const resources = fallbackTranslations[lang] || fallbackTranslations['zh-CN'];
        
        // 直接查找键
        let value = resources[key];
        
        // 如果是点号分隔的复合键
        if (!value && key.includes('.')) {
            const keys = key.split('.');
            value = resources;
            
            for (const k of keys) {
                if (value === undefined) return key;
                value = value[k];
            }
        }
        
        if (!value) return key;
        
        // 处理插值
        if (Object.keys(params).length > 0) {
            return value.replace(/\{([^{}]+)\}/g, (match, paramKey) => {
                const paramValue = params[paramKey];
                return paramValue !== undefined ? paramValue : match;
            });
        }
        
        return value;
    }

    /**
     * 更新界面
     * 检测界面元素并应用翻译
     */
    function updateUI() {
        try {
            // 如果已经加载了新模块化系统，使用新系统更新DOM
            if (window.i18n && window.i18n.domHandler) {
                window.i18n.domHandler.updateDOM();
                
                // 如果新模块化系统包含代码块和图片查看器，使用它们
                if (window.i18n.codeBlockManager) {
                    window.i18n.codeBlockManager.refresh();
                }
                
                if (window.i18n.imageViewer) {
                    window.i18n.imageViewer.refresh();
                }
                
                return;
            }

            // 否则使用内置功能更新关键元素

            // 更新页面标题
            document.title = translate('title');
            
            // 更新导航菜单
            updateNavigationLinks();
            
            // 更新测试按钮
            updateTestButtons();
            
            // 更新测试状态
            updateTestStatus();
            
            // 更新代码标签
            updateCodeLabels();
            
            // 更新测试结果消息
            updateResultMessages();
            
            // 更新代码块复制功能
            updateCodeBlocks();
        } catch (error) {
            console.error('紧急修复: 更新UI失败', error);
        }
    }

    /**
     * 更新导航链接
     */
    function updateNavigationLinks() {
        // 处理首页链接 - 使用多种选择器
        const homeSelectors = [
            'a[href="../../index.html"]',
            'a[href="../index.html"]',
            'a[href="index.html"]',
            'a[href="/"]',
            'a[href="/index.html"]'
        ];
        
        let homeLink = null;
        for (const selector of homeSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                homeLink = elements[0];
                break;
            }
        }
        
        // 基于文本内容查找
        if (!homeLink) {
            const allLinks = document.querySelectorAll('nav a, header a');
            for (const link of allLinks) {
                const text = link.textContent.trim();
                if (text.includes('首页') || text.includes('Home') || 
                    text === 'nav.home' ||
                    (link.querySelector('i.ri-home-4-line'))) {
                    homeLink = link;
                    break;
                }
            }
        }
        
        if (homeLink) {
            const icon = homeLink.querySelector('i');
            homeLink.innerHTML = '';
            if (icon) homeLink.appendChild(icon);
            homeLink.appendChild(document.createTextNode(' ' + translate('nav.home')));
        }
        
        // 处理测试用例链接
        const caseSelectors = [
            'a[href="../../cases/index.html"]', 
            'a[href="../cases/index.html"]',
            'a[href="cases/index.html"]',
            'a[href="/cases"]',
            'a[href="/cases/index.html"]'
        ];
        
        let caseLink = null;
        for (const selector of caseSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                caseLink = elements[0];
                break;
            }
        }
        
        // 基于文本内容查找
        if (!caseLink) {
            const allLinks = document.querySelectorAll('nav a, header a');
            for (const link of allLinks) {
                const text = link.textContent.trim();
                if (text.includes('测试用例') || text.includes('Test Cases') || 
                    text === 'nav.testCases' ||
                    link.querySelector('i.ri-test-tube-line')) {
                    caseLink = link;
                    break;
                }
            }
        }
        
        if (caseLink) {
            const icon = caseLink.querySelector('i');
            caseLink.innerHTML = '';
            if (icon) caseLink.appendChild(icon);
            caseLink.appendChild(document.createTextNode(' ' + translate('nav.testCases')));
        }
    }

    /**
     * 更新测试按钮
     */
    function updateTestButtons() {
        // 处理测试按钮
        const testButton = document.getElementById('testButton');
        if (testButton) {
            testButton.textContent = translate('testCase.startTest');
        }
        
        // 处理其他可能的测试按钮
        document.querySelectorAll('button[onclick*="runTest"]').forEach(button => {
            const text = button.textContent.trim();
            if (text.includes('开始测试') || text.includes('Start Test') || 
                text === 'testCase.startTest') {
                button.textContent = translate('testCase.startTest');
            }
        });
    }

    /**
     * 更新测试状态
     */
    function updateTestStatus() {
        const testStatus = document.getElementById('testStatus');
        if (testStatus) {
            if (testStatus.textContent.includes('测试运行中') || 
                testStatus.textContent.includes('Test Running')) {
                testStatus.textContent = translate('testCase.testRunning');
            } else if (testStatus.textContent.includes('测试完成') || 
                      testStatus.textContent.includes('Test Complete')) {
                testStatus.textContent = translate('testCase.testComplete');
            }
        }
    }

    /**
     * 更新代码标签
     */
    function updateCodeLabels() {
        // 创建完整的样式覆盖，强制覆盖原有的content属性值
        const style = document.createElement('style');
        style.textContent = `
            .code-block::before { 
                content: "${translate('testCase.codeLabel')}" !important; 
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
     * 更新测试结果消息
     */
    function updateResultMessages() {
        const successMsg = document.querySelector('#success');
        if (successMsg) {
            const execTime = successMsg.querySelector('#execTime');
            const time = execTime ? execTime.textContent : '0';
            
            successMsg.innerHTML = translate('testCase.success.title') + 
                '<div class="details">' + 
                translate('testCase.success.detail', {time: '<span id="execTime">' + time + '</span>'}) + 
                '</div>';
        }
        
        const failureMsg = document.querySelector('#failure');
        if (failureMsg) {
            const execTime = failureMsg.querySelector('#execTimeFailure');
            const time = execTime ? execTime.textContent : '0';
            
            failureMsg.innerHTML = translate('testCase.failure.title') + 
                '<div class="details">' + 
                translate('testCase.failure.detail', {time: '<span id="execTimeFailure">' + time + '</span>'}) + 
                '</div>';
        }
    }

    /**
     * 更新代码块
     * 添加复制按钮功能
     */
    function updateCodeBlocks() {
        document.querySelectorAll('.code-block').forEach(block => {
            // 检查是否已有复制按钮
            if (block.parentNode.querySelector('.copy-button')) {
                return;
            }
            
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'button copy-button';
            copyButton.style.float = 'right';
            copyButton.style.padding = '0.25rem 0.5rem';
            copyButton.style.fontSize = '0.875rem';
            copyButton.textContent = translate('common.copyCode');
            
            // 添加复制功能
            copyButton.addEventListener('click', () => {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = translate('common.copied');
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                });
            });

            // 添加到DOM
            block.parentNode.insertBefore(copyButton, block);
        });
    }

    /**
     * 语言切换功能
     */
    function setupLanguageSwitcher() {
        const langZh = document.getElementById('lang-zh');
        const langEn = document.getElementById('lang-en');
        
        if (langZh) {
            langZh.addEventListener('click', function() {
                try {
                    localStorage.setItem('locale', 'zh-CN');
                    updateLanguageSwitcherUI('zh-CN');
                    updateUI();
                } catch (e) {
                    console.error('切换语言失败:', e);
                }
            });
        }
        
        if (langEn) {
            langEn.addEventListener('click', function() {
                try {
                    localStorage.setItem('locale', 'en-US');
                    updateLanguageSwitcherUI('en-US');
                    updateUI();
                } catch (e) {
                    console.error('切换语言失败:', e);
                }
            });
        }
        
        // 初始更新切换器UI
        updateLanguageSwitcherUI(getCurrentLang());
    }

    /**
     * 更新语言切换器UI
     * @param {string} currentLang - 当前语言
     */
    function updateLanguageSwitcherUI(currentLang) {
        const options = document.querySelectorAll('.lang-option');
        options.forEach(option => {
            if (option.getAttribute('data-lang') === currentLang) {
                option.classList.add('active');
                option.style.background = '#4f46e5';
                option.style.color = 'white';
                
                // 确保勾选图标存在
                if (!option.querySelector('i')) {
                    const icon = document.createElement('i');
                    icon.className = 'ri-check-line';
                    icon.style.marginRight = '4px';
                    option.prepend(icon);
                }
            } else {
                option.classList.remove('active');
                option.style.background = '';
                option.style.color = '';
                
                // 移除勾选图标
                const icon = option.querySelector('i');
                if (icon) option.removeChild(icon);
            }
        });
    }

    /**
     * 初始化监听器
     * 监听DOM变化，确保动态添加的内容也能得到翻译
     */
    function setupObservers() {
        // 使用MutationObserver监视DOM变化
        try {
            const observer = new MutationObserver(function(mutations) {
                let needUpdate = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        needUpdate = true;
                    }
                });
                
                if (needUpdate) {
                    // 在DOM变化后延迟执行更新，避免频繁更新
                    clearTimeout(window._i18nUpdateTimer);
                    window._i18nUpdateTimer = setTimeout(function() {
                        updateUI();
                    }, 100);
                }
            });
            
            // 观察整个文档
            observer.observe(document.body, {
                childList: true, 
                subtree: true
            });
        } catch (e) {
            console.error('设置DOM观察器失败:', e);
        }
        
        // 添加特殊事件监听
        document.addEventListener('DOMContentLoaded', updateUI);
        window.addEventListener('load', updateUI);
    }

    /**
     * 加载新模块化系统
     */
    function loadModularSystem() {
        try {
            // 检查是否已经添加了模块化系统的脚本
            if (document.querySelector('script[src*="app.js"], script[src*="main-new.js"]')) {
                console.log('模块化系统脚本已存在，跳过加载');
                return;
            }
            
            // 尝试加载新的模块化系统
            const appScript = document.createElement('script');
            appScript.type = 'module';
            
            // 尝试确定正确的路径
            const currentPath = window.location.pathname;
            
            if (currentPath.includes('/cases/')) {
                appScript.src = '../js/main-new.js';
            } else if (currentPath.includes('/test-cases/')) {
                const pathParts = currentPath.split('/');
                // 计算需要回退的目录层级
                const depth = pathParts.length - pathParts.indexOf('test-cases') - 1;
                appScript.src = '../'.repeat(depth) + 'js/main-new.js';
            } else {
                appScript.src = 'js/main-new.js';
            }
            
            console.log(`尝试加载模块化系统: ${appScript.src}`);
            
            // 添加加载完成的处理函数
            appScript.onload = function() {
                console.log('模块化系统加载成功');
            };
            
            appScript.onerror = function() {
                console.error('模块化系统加载失败，将使用紧急修复版本');
                // 立即更新UI
                updateUI();
            };
            
            document.head.appendChild(appScript);
        } catch (e) {
            console.error('尝试加载模块化系统失败:', e);
        }
    }

    // 初始化方法
    function init() {
        console.log('初始化紧急修复版国际化系统');
        
        // 尝试加载新的模块化系统
        loadModularSystem();
        
        // 无论模块化系统是否加载成功，都先更新UI
        updateUI();
        
        // 设置语言切换器
        setupLanguageSwitcher();
        
        // 设置观察器
        setupObservers();
        
        // 延迟执行一次更新，确保异步加载的内容也得到处理
        setTimeout(updateUI, 500);
    }
    
    // 执行初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // 导出全局翻译函数
    window.t = translate;
    window.emergencyI18n = {
        t: translate,
        updateUI: updateUI,
        getCurrentLang: getCurrentLang,
        manualUpdate: function() {
            updateUI();
            updateNavigationLinks();
            updateTestButtons();
            updateResultMessages();
            updateCodeBlocks();
        }
    };
})(); 
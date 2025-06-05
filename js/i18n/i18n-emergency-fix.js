/**
 * 紧急修复版国际化处理
 * 简化版本，避免任何可能的循环引用或性能问题
 */

(function() {
    console.log('== 紧急修复版国际化系统启动 ==');
    
    // 防止重复初始化
    if (window.emergencyI18nInitialized) {
        return;
    }
    window.emergencyI18nInitialized = true;
    
    // 基本翻译资源
    const translations = {
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
            'testCase.guide.title': '测试指南',
            'testCase.success.title': '🎉 恭喜！你已成功绕过 debugger 断点！',
            'testCase.success.detail': '执行时间: {time}ms', 
            'testCase.failure.title': '❌ 未能完全绕过 debugger 断点',
            'testCase.failure.detail': '执行时间: {time}ms，超过了 100ms 的限制，说明断点仍然生效。'
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
            'testCase.guide.title': 'Test Guide',
            'testCase.success.title': '🎉 Congratulations! You have successfully bypassed the debugger breakpoint!',
            'testCase.success.detail': 'Execution time: {time}ms',
            'testCase.failure.title': '❌ Failed to completely bypass the debugger breakpoint',
            'testCase.failure.detail': 'Execution time: {time}ms, exceeding the 100ms limit, indicating the breakpoint is still effective.'
        }
    };

    // 获取当前语言
    function getCurrentLang() {
        try {
            const savedLang = localStorage.getItem('lang');
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
    
    // 尝试强制使用页面上选中的语言选项
    function forcePageSelectedLanguage() {
        try {
            const activeOption = document.querySelector('.lang-option.active');
            if (activeOption) {
                const lang = activeOption.getAttribute('data-lang');
                if (lang && (lang === 'zh-CN' || lang === 'en-US')) {
                    localStorage.setItem('lang', lang);
                    return lang;
                }
            }
        } catch (e) {
            console.error('获取页面语言选择失败:', e);
        }
        return null;
    }
    
    // 获取翻译
    function t(key, params = {}) {
        const lang = forcePageSelectedLanguage() || getCurrentLang();
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
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
    
    // 直接更新关键UI元素
    function updateUI() {
        try {
            // 更新页面标题
            document.title = t('title');
            
            // 更新导航菜单 - 使用更灵活的选择器
            updateNavigationLinks();
            
            // 更新测试用例区域
            updateTestButtons();
            
            // 更新测试状态文本
            const testStatus = document.getElementById('testStatus');
            if (testStatus && testStatus.textContent.includes('测试运行中')) {
                testStatus.textContent = t('testCase.testRunning');
            } else if (testStatus && testStatus.textContent.includes('测试完成')) {
                testStatus.textContent = t('testCase.testComplete');
            }
            
            // 更新代码标签
            const style = document.createElement('style');
            style.textContent = `
                .code-block::before { 
                    content: "${t('testCase.codeLabel')}" !important; 
                }
            `;
            document.head.appendChild(style);
            
            // 更新测试结果消息
            updateResultMessages();
        } catch (error) {
            console.error('Emergency I18n: 更新UI失败', error);
        }
    }
    
    // 更新导航链接
    function updateNavigationLinks() {
        // 处理首页链接 - 使用多种选择器以确保匹配
        const homeSelectors = [
            'a[href="../../index.html"]',
            'a[href="../index.html"]',
            'a[href="index.html"]',
            'a[href="/"]',
            'a[href="/index.html"]',
            'a.nav-home',
            'nav a[href*="index.html"]:first-of-type'
        ];
        
        let homeLink = null;
        for (const selector of homeSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    // 使用第一个匹配元素
                    homeLink = elements[0];
                    break;
                }
            } catch (e) {
                console.log('选择器解析错误，跳过: ' + selector);
            }
        }
        
        // 如果还是没有找到，尝试基于文本内容查找
        if (!homeLink) {
            const allLinks = document.querySelectorAll('nav a, header a');
            for (const link of allLinks) {
                const text = link.textContent.trim();
                if (text.includes('首页') || text.includes('Home') || 
                    text === 'nav.home' ||
                    (link.querySelector('i.ri-home-4-line') && !link.querySelector('i.ri-test-tube-line'))) {
                    homeLink = link;
                    break;
                }
            }
        }
        
        if (homeLink) {
            const icon = homeLink.querySelector('i');
            homeLink.innerHTML = '';
            if (icon) homeLink.appendChild(icon);
            homeLink.appendChild(document.createTextNode(' ' + t('nav.home')));
        }
        
        // 处理测试用例链接 - 使用多种选择器
        const casesSelectors = [
            'a[href="../../cases/index.html"]', 
            'a[href="../cases/index.html"]',
            'a[href="cases/index.html"]',
            'a[href="/cases"]',
            'a[href="/cases/index.html"]',
            'a.nav-cases',
            'nav a[href*="cases"]:first-of-type'
        ];
        
        let casesLink = null;
        for (const selector of casesSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    casesLink = elements[0];
                    break;
                }
            } catch (e) {
                console.log('选择器解析错误，跳过: ' + selector);
            }
        }
        
        // 如果还是没有找到，尝试基于文本内容查找
        if (!casesLink) {
            const allLinks = document.querySelectorAll('nav a, header a');
            for (const link of allLinks) {
                const text = link.textContent.trim();
                if (text.includes('测试用例') || text.includes('Test Cases') || 
                    text === 'nav.testCases' ||
                    link.querySelector('i.ri-test-tube-line')) {
                    casesLink = link;
                    break;
                }
            }
        }
        
        if (casesLink) {
            const icon = casesLink.querySelector('i');
            casesLink.innerHTML = '';
            if (icon) casesLink.appendChild(icon);
            casesLink.appendChild(document.createTextNode(' ' + t('nav.testCases')));
        }
    }
    
    // 更新测试按钮
    function updateTestButtons() {
        // 处理测试按钮
        const testButtonSelectors = [
            '#testButton',
            'button[onclick*="runTest"]',
            '.btn-start-test'
        ];
        
        let testButton = null;
        for (const selector of testButtonSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    testButton = elements[0];
                    break;
                }
            } catch (e) {
                console.log('选择器解析错误，跳过: ' + selector);
            }
        }
        
        // 如果还是没找到，尝试基于文本内容
        if (!testButton) {
            const allButtons = document.querySelectorAll('button');
            for (const button of allButtons) {
                const text = button.textContent.trim();
                if (text.includes('开始测试') || text.includes('Start Test') || 
                    text === 'testCase.startTest') {
                    testButton = button;
                    break;
                }
            }
        }
        
        if (testButton) {
            testButton.textContent = t('testCase.startTest');
        }
    }
    
    // 更新结果消息
    function updateResultMessages() {
        const successMsg = document.querySelector('#success');
        if (successMsg) {
            successMsg.innerHTML = t('testCase.success.title') + 
                '<div class="details">' + 
                t('testCase.success.detail', {time: '<span id="execTime">0</span>'}) + 
                '</div>';
        }
        
        const failureMsg = document.querySelector('#failure');
        if (failureMsg) {
            failureMsg.innerHTML = t('testCase.failure.title') + 
                '<div class="details">' + 
                t('testCase.failure.detail', {time: '<span id="execTimeFailure">0</span>'}) + 
                '</div>';
        }
    }
    
    // 语言切换功能
    function setupLanguageSwitcher() {
        const langZh = document.getElementById('lang-zh');
        const langEn = document.getElementById('lang-en');
        
        if (langZh) {
            langZh.addEventListener('click', function() {
                try {
                    localStorage.setItem('lang', 'zh-CN');
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
                    localStorage.setItem('lang', 'en-US');
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
    
    // 更新语言切换器UI
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
    
    // 等待DOM加载完成后初始化
    function init() {
        updateUI();
        setupLanguageSwitcher();
        
        // 添加对直接显示键名文本的特殊处理
        fixKeyDisplayElements();
        
        // 观察整个导航区域，以便动态更新导航链接
        try {
            const navObserver = new MutationObserver((mutations) => {
                updateNavigationLinks();
            });
            
            const navArea = document.querySelector('nav') || document.querySelector('header');
            if (navArea) {
                navObserver.observe(navArea, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        } catch (e) {
            console.error('设置导航监听器失败:', e);
        }
        
        // 观察按钮和测试区域
        try {
            const testAreaObserver = new MutationObserver((mutations) => {
                updateTestButtons();
                
                // 检查测试状态
                const testStatus = document.getElementById('testStatus');
                if (testStatus) {
                    const content = testStatus.textContent;
                    if (content.includes('测试运行中') || content.includes('Test Running')) {
                        testStatus.textContent = t('testCase.testRunning');
                    } else if (content.includes('测试完成') || content.includes('Test Complete')) {
                        testStatus.textContent = t('testCase.testComplete');
                    }
                }
                
                // 更新结果消息
                updateResultMessages();
            });
            
            const testArea = document.querySelector('.test-container') || document.querySelector('main');
            if (testArea) {
                testAreaObserver.observe(testArea, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        } catch (e) {
            console.error('设置测试区域监听器失败:', e);
        }
        
        // 为testStatus添加简单的监听
        const testStatus = document.getElementById('testStatus');
        if (testStatus) {
            try {
                // 使用更安全的方式监视文本变化：MutationObserver
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            const content = testStatus.textContent;
                            if (content.includes('测试运行中') || content.includes('Test Running')) {
                                testStatus.textContent = t('testCase.testRunning');
                            } else if (content.includes('测试完成') || content.includes('Test Complete')) {
                                testStatus.textContent = t('testCase.testComplete');
                            }
                        }
                    });
                });
                
                // 配置观察器
                observer.observe(testStatus, {
                    childList: true, // 监视子节点的变化
                    characterData: true, // 监视文本内容
                    subtree: true // 监视所有后代节点
                });
                
                // 重写runTest函数中的状态更新
                if (window.runTest && typeof window.runTest === 'function') {
                    const originalRunTest = window.runTest;
                    window.runTest = function() {
                        // 使用原始函数
                        const result = originalRunTest.apply(this, arguments);
                        
                        // 确保状态文本正确翻译
                        setTimeout(() => {
                            const status = document.getElementById('testStatus');
                            if (status) {
                                if (status.textContent.includes('测试运行中') || status.textContent.includes('Test Running')) {
                                    status.textContent = t('testCase.testRunning');
                                } else if (status.textContent.includes('测试完成') || status.textContent.includes('Test Complete')) {
                                    status.textContent = t('testCase.testComplete');
                                }
                            }
                        }, 10);
                        
                        return result;
                    };
                }
            } catch (e) {
                console.error('设置测试状态监听器失败:', e);
            }
        }
        
        // 添加全局事件监听，确保用户交互后的内容更新
        try {
            // 点击事件可能会导致动态内容变化
            document.addEventListener('click', function(event) {
                // 延迟50毫秒，确保DOM更新后再应用翻译
                setTimeout(function() {
                    // 优先更新点击区域附近的内容
                    let targetArea = event.target;
                    while (targetArea && targetArea.nodeName !== 'SECTION' && 
                           targetArea.nodeName !== 'DIV' && targetArea !== document.body) {
                        targetArea = targetArea.parentNode;
                    }
                    
                    if (targetArea) {
                        // 优先处理可能发生变化的区域
                        fixKeyDisplayElements();
                        updateNavigationLinks();
                        updateTestButtons();
                    }
                }, 50);
            });
            
            // 窗口重新获得焦点时更新内容
            window.addEventListener('focus', function() {
                updateUI();
            });
            
            // 监听hash变化，这可能表示页面内容变化了
            window.addEventListener('hashchange', function() {
                // 延迟执行，确保DOM已更新
                setTimeout(updateUI, 100);
            });
        } catch (e) {
            console.error('设置事件监听器失败:', e);
        }
    }
    
    // 特殊函数：修复直接显示键名的元素
    function fixKeyDisplayElements() {
        try {
            // 创建一个遍历DOM树的函数，查找包含关键字模式的文本节点
            const traverseAndFix = function(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 检查是否包含未翻译的键名
                    const content = node.textContent.trim();
                    
                    // 忽略空文本节点
                    if (!content) return;
                    
                    // 常见的键名模式
                    const keyPattern = /^(nav\.|testCase\.|footer\.|title\.|button\.)[a-zA-Z\.]+$/;
                    
                    if (keyPattern.test(content)) {
                        // 尝试翻译
                        const translated = t(content);
                        if (translated !== content) {
                            // 只有在翻译成功的情况下才替换
                            node.textContent = translated;
                            console.log('紧急修复: 转换直接显示的键名', content, '→', translated);
                        }
                    } else if (content === 'nav.home' || content === 'nav.testCases' || 
                               content === 'testCase.startTest' || content === 'footer.feedback') {
                        // 直接匹配常见键名
                        node.textContent = t(content);
                        console.log('紧急修复: 转换直接显示的键名', content, '→', t(content));
                    }
                    
                    // 特殊处理执行测试页面上的按钮
                    if (content === 'testCase.startTest' || content === '开始测试' || content === 'Start Test') {
                        const parentElement = node.parentElement;
                        if (parentElement && (parentElement.tagName === 'BUTTON' || parentElement.id === 'testButton')) {
                            node.textContent = t('testCase.startTest');
                        }
                    }
                }
                
                // 递归处理子节点
                if (node.hasChildNodes()) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        traverseAndFix(node.childNodes[i]);
                    }
                }
            };
            
            // 从body开始遍历整个DOM树
            traverseAndFix(document.body);
            
            // 直接尝试修复已知问题区域
            const navLinks = document.querySelectorAll('nav a, header a');
            navLinks.forEach(link => {
                const text = link.textContent.trim();
                // 处理导航链接
                if (text === 'nav.home' || (text.includes('首页') || text.includes('Home'))) {
                    // 保存图标
                    const icon = link.querySelector('i');
                    link.innerHTML = '';
                    if (icon) link.appendChild(icon);
                    link.appendChild(document.createTextNode(' ' + t('nav.home')));
                } 
                else if (text === 'nav.testCases' || (text.includes('测试用例') || text.includes('Test Cases'))) {
                    // 保存图标
                    const icon = link.querySelector('i');
                    link.innerHTML = '';
                    if (icon) link.appendChild(icon);
                    link.appendChild(document.createTextNode(' ' + t('nav.testCases')));
                }
            });
            
            // 使用MutationObserver监视DOM变化，及时处理新添加的元素
            const keyObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                            traverseAndFix(node);
                        });
                    }
                });
                
                // 直接处理当前可能的导航项问题
                updateNavigationLinks();
                updateTestButtons();
            });
            
            // 配置观察选项
            keyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.error('紧急修复键名处理失败:', e);
        }
    }
    
    // 执行初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
        // 添加延迟重试机制，确保异步加载的内容也能得到正确翻译
        setTimeout(updateUI, 500);
        setTimeout(updateUI, 1500);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            // 添加延迟重试机制，确保异步加载的内容也能得到正确翻译
            setTimeout(updateUI, 500);
            setTimeout(updateUI, 1500);
        });
    }
    
    // 导出全局翻译函数
    window.t = t;
    window.emergencyI18n = {
        t,
        updateUI,
        getCurrentLang,
        
        // 添加公共方法，方便其他代码调用
        manualUpdate: function() {
            updateUI();
            updateNavigationLinks();
            updateTestButtons();
            updateResultMessages();
        }
    };
})(); 
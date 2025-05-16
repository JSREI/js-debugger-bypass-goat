class I18n {
    constructor() {
        // 先尝试读取localStorage，如果失败则使用浏览器语言
        try {
            const savedLang = localStorage.getItem('lang');
            this.currentLang = savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US') 
                ? savedLang 
                : this.getBrowserLang();
            console.log('初始化语言: ', this.currentLang, '(saved:', savedLang, ')');
        } catch (e) {
            console.error('读取语言设置失败: ', e);
            this.currentLang = this.getBrowserLang();
        }
        
        this.translations = {
            'zh-CN': zhCN,
            'en-US': enUS
        };
        
        // 动态加载所有国际化处理模块
        this.modules = [];
        
        // 尝试加载模块
        try {
            if (typeof I18nHome !== 'undefined') this.modules.push(new I18nHome(this));
            if (typeof I18nCases !== 'undefined') this.modules.push(new I18nCases(this));
            if (typeof I18nCaseDetail !== 'undefined') this.modules.push(new I18nCaseDetail(this));
        } catch (e) {
            console.error('加载I18n模块失败:', e);
        }
        
        this.init();
    }

    // 获取浏览器语言
    getBrowserLang() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
    }

    // 初始化
    init() {
        // 绑定切换事件
        this.bindEvents();
        // 应用当前语言
        this.setLanguage(this.currentLang, true);
    }

    // 绑定切换事件
    bindEvents() {
        const langZh = document.getElementById('lang-zh');
        const langEn = document.getElementById('lang-en');
        
        if (langZh) langZh.addEventListener('click', () => this.setLanguage('zh-CN'));
        if (langEn) langEn.addEventListener('click', () => this.setLanguage('en-US'));
    }

    // 设置语言
    setLanguage(lang, updateUI = true) {
        this.currentLang = lang;
        
        // 保存到localStorage
        try {
            localStorage.setItem('lang', lang);
            console.log('语言已保存: ', lang);
        } catch (e) {
            console.error('保存语言设置失败: ', e);
        }
        
        // 更新语言选择器 UI
        if (updateUI) {
            const options = document.querySelectorAll('.lang-option');
            options.forEach(option => {
                if (option.getAttribute('data-lang') === lang) {
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
        
        // 更新页面标题
        document.title = this.t('title');
        
        // 更新导航，保留图标
        const homeLink = document.querySelector('.nav-right ul li:first-child a');
        const testCasesLink = document.querySelector('.nav-right ul li:nth-child(2) a');
        
        // 保留图标，只更新文本内容
        if (homeLink) {
            const icon = homeLink.querySelector('i');
            homeLink.innerHTML = '';
            if (icon) homeLink.appendChild(icon);
            homeLink.appendChild(document.createTextNode(' ' + this.t('nav.home')));
        }
        
        if (testCasesLink) {
            const icon = testCasesLink.querySelector('i');
            testCasesLink.innerHTML = '';
            if (icon) testCasesLink.appendChild(icon);
            testCasesLink.appendChild(document.createTextNode(' ' + this.t('nav.testCases')));
        }
        
        // 更新页脚
        const feedback = document.querySelector('.footer-links a:nth-child(2)');
        if (feedback) {
            const icon = feedback.querySelector('i');
            feedback.innerHTML = '';
            if (icon) feedback.appendChild(icon);
            feedback.appendChild(document.createTextNode(' ' + this.t('footer.feedback')));
        }
        
        // 调用各个模块的更新方法
        this.modules.forEach(module => {
            if (typeof module.update === 'function') {
                module.update();
            }
        });
    }

    // 获取翻译文本
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }
        
        return value || key;
    }
} 
/**
 * @deprecated 此文件已弃用，请使用新的模块化系统 
 * 
 * 为保证向下兼容性，此文件仍然可用，但建议使用新的模块化系统
 * 如有任何问题，请参考compat.js中的兼容实现
 */

console.warn('[DEPRECATED] i18n-core.js 已弃用，请使用新的模块化系统');

/**
 * 增强版多语言支持核心库
 * 支持声明式绑定、自动翻译、动态内容插值等功能
 */
class I18n {
    constructor() {
        // 防止多次初始化
        if (window.i18nCoreInitializing) {
            console.log('I18n正在初始化中，避免重复初始化');
            return;
        }
        window.i18nCoreInitializing = true;
        
        // 创建语言切换监听器列表
        this.listeners = [];
        
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
        
        // 模块加载限制
        this.moduleLoadAttempts = 0;
        this.maxLoadAttempts = 3;
        
        // 检查翻译资源是否可用
        if (typeof zhCN === 'undefined' || typeof enUS === 'undefined') {
            console.error('翻译资源不可用，尝试延迟加载');
            // 在未来尝试再次加载
            if (this.moduleLoadAttempts < this.maxLoadAttempts) {
                this.moduleLoadAttempts++;
                setTimeout(() => this.loadTranslationResources(), 300);
            }
            return;
        }
        
        // 加载翻译资源
        this.loadTranslationResources();
        
        // 设置初始化完成标志
        window.i18nCoreInitializing = false;
        
        // 初始化
        this.init();
    }
    
    /**
     * 加载翻译资源
     */
    loadTranslationResources() {
        // 防止无限递归
        if (this.moduleLoadAttempts >= this.maxLoadAttempts) {
            console.error('翻译资源加载失败，达到最大尝试次数');
            return;
        }
        
        // 检查语言资源对象是否已经定义
        if (typeof zhCN !== 'undefined' && typeof enUS !== 'undefined') {
            this.translations = {
                'zh-CN': zhCN,
                'en-US': enUS
            };
            
            // 确保没有正在进行的模块加载
            if (!this.modulesLoading) {
                this.modulesLoading = true;
                // 安全地加载模块
                setTimeout(() => {
                    try {
                        this.loadI18nModules();
                    } catch (e) {
                        console.error('加载i18n模块失败:', e);
                    }
                    this.modulesLoading = false;
                }, 0);
            }
            
            // 如果还没初始化，现在初始化
            if (!this.initialized) {
                this.init();
            }
        } else {
            console.error('翻译资源仍然不可用');
            // 增加尝试次数
            this.moduleLoadAttempts++;
            // 延迟尝试再次加载
            if (this.moduleLoadAttempts < this.maxLoadAttempts) {
                setTimeout(() => this.loadTranslationResources(), 500 * this.moduleLoadAttempts);
            }
        }
    }
    
    /**
     * 加载国际化模块
     */
    loadI18nModules() {
        // 初始化模块数组
        if (!this.modules) {
            this.modules = [];
        }
        
        try {
            // 安全检查所有可能的模块
            this.safelyLoadModules();
        } catch (e) {
            console.error('加载I18n模块失败:', e);
        }
    }
    
    /**
     * 安全地加载模块，避免类未定义错误
     */
    safelyLoadModules() {
        // 首先检查主处理器
        if (typeof I18nCaseProcessor !== 'undefined') {
            // 避免重复添加模块
            if (!this.hasModule('I18nCaseProcessor')) {
                console.log('使用新的I18nCaseProcessor模块');
                try {
                    this.modules.push(new I18nCaseProcessor(this));
                } catch (e) {
                    console.error('I18nCaseProcessor初始化失败:', e);
                }
            }
            return;
        } 
        
        // 加载特定模块
        if (typeof I18nHome !== 'undefined' && !this.hasModule('I18nHome')) {
            console.log('加载I18nHome模块');
            try {
                this.modules.push(new I18nHome(this));
            } catch (e) {
                console.error('I18nHome初始化失败:', e);
            }
        }
        
        if (typeof I18nCases !== 'undefined' && !this.hasModule('I18nCases')) {
            console.log('加载I18nCases模块');
            try {
                this.modules.push(new I18nCases(this));
            } catch (e) {
                console.error('I18nCases初始化失败:', e);
            }
        }
        
        // 尝试加载兼容层
        this.tryLoadCaseDetail();
    }
    
    /**
     * 检查是否已加载特定类型的模块
     */
    hasModule(className) {
        if (!this.modules) return false;
        return this.modules.some(module => 
            module.constructor && 
            module.constructor.name === className);
    }
    
    /**
     * 尝试加载I18nCaseDetail模块
     */
    tryLoadCaseDetail() {
        // 防止重复加载
        if (this.hasModule('I18nCaseDetail')) {
            return;
        }
        
        // 检查I18nCaseDetail是否已存在
        if (typeof I18nCaseDetail !== 'undefined') {
            console.log('使用兼容模式：I18nCaseDetail');
            try {
                // 添加到模块列表
                this.modules.push(new I18nCaseDetail(this));
            } catch (e) {
                console.warn('I18nCaseDetail加载失败，可能缺少依赖:', e);
                // 不要在这里递归尝试再次加载
            }
        }
    }

    /**
     * 获取浏览器语言
     */
    getBrowserLang() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
    }

    /**
     * 初始化i18n功能
     */
    init() {
        // 防止重复初始化
        if (this.initialized) {
            return;
        }
        
        this.initialized = true;
        
        // 绑定切换事件
        this.bindEvents();
        
        // 应用当前语言
        this.setLanguage(this.currentLang, true);
        
        // DOM加载完成后自动翻译页面
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.translatePage();
            this.observeDOMChanges();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this.translatePage();
                
                // 监视DOM变化，自动翻译新添加的元素
                this.observeDOMChanges();
            });
        }
    }

    /**
     * 绑定语言切换事件
     */
    bindEvents() {
        const langZh = document.getElementById('lang-zh');
        const langEn = document.getElementById('lang-en');
        
        if (langZh) langZh.addEventListener('click', () => this.setLanguage('zh-CN'));
        if (langEn) langEn.addEventListener('click', () => this.setLanguage('en-US'));
    }

    /**
     * 设置语言
     * @param {string} lang - 语言代码
     * @param {boolean} updateUI - 是否更新UI
     */
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
            this.updateLanguageSwitcher();
        }
        
        // 更新整个页面的翻译
        this.translatePage();
        
        // 更新全局语言变量
        if (window.currentLang !== undefined) {
            window.currentLang = lang;
        }
        
        // 调用各个模块的更新方法（向后兼容）
        if (this.modules && this.modules.length > 0) {
            this.modules.forEach(module => {
                if (typeof module.update === 'function') {
                    try {
                        module.update();
                    } catch (error) {
                        console.error('模块更新失败:', error);
                    }
                }
            });
        }
        
        // 调用监听器
        this.notifyListeners();
    }
    
    /**
     * 更新语言切换器UI
     */
    updateLanguageSwitcher() {
        const options = document.querySelectorAll('.lang-option');
        options.forEach(option => {
            if (option.getAttribute('data-lang') === this.currentLang) {
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
     * 获取翻译文本
     * @param {string} key - 翻译键
     * @param {Object} params - 插值参数
     * @return {string} 翻译后的文本
     */
    t(key, params = {}) {
        // 确保翻译资源已加载
        if (!this.translations) {
            console.warn('翻译资源尚未加载，尝试重新加载');
            this.loadTranslationResources();
            return key;
        }
        
        // 逐层查找翻译
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }
        
        if (!value) return key;
        
        // 如果有插值参数，进行替换
        if (Object.keys(params).length > 0) {
            return this.interpolate(value, params);
        }
        
        return value;
    }
    
    /**
     * 执行文本插值
     * @param {string} text - 带插值标记的文本
     * @param {Object} params - 插值参数
     * @return {string} 替换后的文本
     */
    interpolate(text, params) {
        return text.replace(/\{([^{}]+)\}/g, (match, key) => {
            const value = params[key];
            return value !== undefined ? value : match;
        });
    }
    
    /**
     * 翻译整个页面
     * 扫描所有带有data-i18n属性的元素并进行翻译
     */
    translatePage() {
        try {
            // 更新页面标题
            document.title = this.t('title');
            
            // 查找所有带有data-i18n属性的元素
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => this.translateElement(el));
            
            // 查找所有带有data-i18n-attr的元素（属性翻译）
            const attrElements = document.querySelectorAll('[data-i18n-attr]');
            attrElements.forEach(el => this.translateAttribute(el));
            
            // 查找所有带有data-i18n-html的元素（HTML内容翻译）
            const htmlElements = document.querySelectorAll('[data-i18n-html]');
            htmlElements.forEach(el => this.translateHTML(el));
        } catch (error) {
            console.error('页面翻译失败:', error);
        }
    }
    
    /**
     * 翻译单个元素
     * @param {Element} el - 需要翻译的DOM元素
     */
    translateElement(el) {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        
        // 获取插值参数
        const params = this.getElementParams(el);
        
        // 翻译并设置文本内容
        el.textContent = this.t(key, params);
    }
    
    /**
     * 翻译元素属性
     * @param {Element} el - 需要翻译属性的DOM元素
     */
    translateAttribute(el) {
        const attrInfo = el.getAttribute('data-i18n-attr');
        if (!attrInfo) return;
        
        // 格式: "attribute:key"，如 "placeholder:form.email"
        const [attr, key] = attrInfo.split(':');
        if (!attr || !key) return;
        
        // 获取插值参数
        const params = this.getElementParams(el);
        
        // 翻译并设置属性值
        el.setAttribute(attr, this.t(key, params));
    }
    
    /**
     * 翻译HTML内容
     * @param {Element} el - 需要翻译HTML内容的DOM元素
     */
    translateHTML(el) {
        const key = el.getAttribute('data-i18n-html');
        if (!key) return;
        
        // 获取插值参数
        const params = this.getElementParams(el);
        
        // 翻译并设置HTML内容
        el.innerHTML = this.t(key, params);
    }
    
    /**
     * 获取元素的插值参数
     * @param {Element} el - DOM元素
     * @return {Object} 参数对象
     */
    getElementParams(el) {
        // 获取data-i18n-params属性值
        const paramsAttr = el.getAttribute('data-i18n-params');
        if (!paramsAttr) return {};
        
        try {
            // 尝试解析JSON格式的参数
            return JSON.parse(paramsAttr);
        } catch (e) {
            console.error('解析i18n参数失败:', e, paramsAttr);
            return {};
        }
    }
    
    /**
     * 监视DOM变化，自动翻译新添加的元素
     */
    observeDOMChanges() {
        try {
            const observer = new MutationObserver(mutations => {
                let needsTranslation = false;
                
                // 检查是否有新添加的需要翻译的元素
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 检查元素本身是否需要翻译
                                if (
                                    node.hasAttribute('data-i18n') || 
                                    node.hasAttribute('data-i18n-attr') || 
                                    node.hasAttribute('data-i18n-html')
                                ) {
                                    needsTranslation = true;
                                }
                                
                                // 检查子元素是否需要翻译
                                if (
                                    node.querySelector('[data-i18n], [data-i18n-attr], [data-i18n-html]')
                                ) {
                                    needsTranslation = true;
                                }
                            }
                        });
                    }
                });
                
                // 如果有新元素需要翻译，则翻译整个页面
                if (needsTranslation) {
                    this.translatePage();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.error('DOM变化监听失败:', error);
        }
    }
    
    /**
     * 添加语言变更监听器
     * @param {Function} listener - 监听函数
     */
    addLanguageChangeListener(listener) {
        if (typeof listener === 'function' && !this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
    
    /**
     * 移除语言变更监听器
     * @param {Function} listener - 要移除的监听函数
     */
    removeLanguageChangeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    /**
     * 通知所有监听器语言已变更
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.currentLang);
            } catch (e) {
                console.error('调用语言监听器时出错:', e);
            }
        });
    }
}

// 创建全局实例
if (!window.i18nInstance) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        window.i18nInstance = new I18n();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            window.i18nInstance = new I18n();
        });
    }
} 
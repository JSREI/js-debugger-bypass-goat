/**
 * 向下兼容层
 * 提供与旧版I18n系统兼容的接口
 */
import { I18nManager } from './i18n/core/i18n-manager.js';
import { DOMHandler } from './i18n/core/dom-handler.js';
import { ResourceLoader } from './i18n/core/resource-loader.js';
import { LOCALES } from './core/constants.js';

/**
 * 旧版I18n类的兼容实现
 * 替代旧版本中的 I18n 类
 */
class I18n {
    constructor() {
        // 获取单例实例
        this.i18n = I18nManager.getInstance();
        this.domHandler = DOMHandler.getInstance();
        this.resourceLoader = ResourceLoader.getInstance();
        
        // 自动初始化
        this._init();
        
        // 导出全局翻译函数以确保兼容
        window.t = (key, params) => this.i18n.translate(key, params);
        
        // 兼容旧版API
        window.i18n = {
            translate: (key, params) => this.i18n.translate(key, params),
            setLocale: (locale) => this.i18n.setLocale(locale),
            getLocale: () => this.i18n.getLocale(),
            t: (key, params) => this.i18n.translate(key, params)
        };
    }
    
    /**
     * 初始化国际化系统
     * @private
     */
    async _init() {
        try {
            // 加载所有语言资源
            await this.resourceLoader.loadAllLocales();
            
            // 更新DOM
            this.domHandler.updateDOM();
        } catch (error) {
            console.error('初始化国际化系统失败:', error);
        }
    }
    
    /**
     * 兼容旧的翻译方法
     * @param {string} key - 翻译键
     * @param {Object} params - 插值参数
     * @returns {string} - 翻译结果
     */
    t(key, params) {
        return this.i18n.translate(key, params);
    }
    
    /**
     * 兼容旧的语言切换方法
     * @param {string} locale - 要切换的语言
     * @returns {boolean} - 是否切换成功
     */
    setLocale(locale) {
        return this.i18n.setLocale(locale);
    }
    
    /**
     * 兼容旧的获取当前语言方法
     * @returns {string} - 当前语言
     */
    getLocale() {
        return this.i18n.getLocale();
    }
}

/**
 * 旧版I18nBase类的兼容实现
 * 替代旧版本中的 I18nBase 类
 */
class I18nBase extends I18n {
    constructor() {
        super();
    }
    
    /**
     * 更新指定元素的翻译
     * @param {Element} element - DOM元素
     * @param {string} key - 翻译键
     * @param {Object} params - 插值参数
     */
    updateElement(element, key, params) {
        if (!element) return;
        
        element.setAttribute('data-i18n', key);
        if (params) {
            element.setAttribute('data-i18n-params', JSON.stringify(params));
        }
        
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'button' || element.type === 'submit')) {
            element.value = this.i18n.translate(key, params);
        } else {
            element.textContent = this.i18n.translate(key, params);
        }
    }
}

/**
 * 旧版I18nCaseDetail类的兼容实现
 * 替代旧版本中的 I18nCaseDetail 类
 */
class I18nCaseDetail extends I18nBase {
    constructor() {
        super();
        
        // 初始化测试用例页面特有的元素
        this._updateTestElements();
    }
    
    /**
     * 更新测试用例页面特有的元素
     * @private
     */
    _updateTestElements() {
        // 这些功能已由DOMHandler实现，这里只是为了兼容旧代码
        // 会自动处理:
        // 1. 测试按钮文本
        // 2. 测试状态
        // 3. 代码标签
        // 4. 测试结果消息
        
        // 如果有特定页面需要额外处理的元素，可以在这里添加
    }
}

/**
 * 导出兼容类，使它们可以被全局访问
 */
window.I18n = I18n;
window.I18nBase = I18nBase;
window.I18nCaseDetail = I18nCaseDetail;

// 为旧代码提供这些类
export { 
    I18n,
    I18nBase,
    I18nCaseDetail
}; 
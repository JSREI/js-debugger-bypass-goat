/**
 * 国际化管理器
 * 负责管理语言切换和翻译功能
 */
import { EventEmitter } from '../../core/event-emitter.js';
import { EVENTS, LOCALES, STORAGE_KEYS } from '../../core/constants.js';
import { getBrowserLanguage, getFromStorage, setToStorage } from '../../core/utils.js';

export class I18nManager {
    /**
     * 单例模式，获取I18nManager实例
     * @returns {I18nManager} - I18nManager实例
     */
    static getInstance() {
        if (!I18nManager._instance) {
            I18nManager._instance = new I18nManager();
        }
        return I18nManager._instance;
    }

    constructor() {
        // 确保单例
        if (I18nManager._instance) {
            return I18nManager._instance;
        }

        this.eventEmitter = new EventEmitter();
        this.resources = {};
        this.isLoaded = false;
        
        // 初始化当前语言
        this.currentLocale = this._detectLocale();
        
        // 存储单例
        I18nManager._instance = this;
    }

    /**
     * 检测当前语言
     * @private
     * @returns {string} - 当前语言
     */
    _detectLocale() {
        // 优先从localStorage读取
        const savedLocale = getFromStorage(STORAGE_KEYS.LOCALE);
        
        if (savedLocale && (savedLocale === LOCALES.ZH_CN || savedLocale === LOCALES.EN_US)) {
            return savedLocale;
        }
        
        // 使用浏览器语言
        return getBrowserLanguage();
    }

    /**
     * 加载资源
     * @param {string} locale - 语言代码
     * @param {Object} resources - 语言资源对象
     * @returns {I18nManager} - 链式调用
     */
    loadResources(locale, resources) {
        this.resources[locale] = resources;
        this.isLoaded = true;
        this.eventEmitter.emit(EVENTS.TRANSLATIONS_LOADED, locale);
        return this;
    }

    /**
     * 设置当前语言
     * @param {string} locale - 语言代码
     * @returns {boolean} - 是否设置成功
     */
    setLocale(locale) {
        // 检查语言是否支持
        if (locale !== LOCALES.ZH_CN && locale !== LOCALES.EN_US) {
            console.warn(`不支持的语言: ${locale}`);
            return false;
        }
        
        // 检查资源是否已加载
        if (!this.resources[locale]) {
            console.warn(`语言资源未加载: ${locale}`);
            return false;
        }
        
        // 设置当前语言
        this.currentLocale = locale;
        
        // 保存到localStorage
        setToStorage(STORAGE_KEYS.LOCALE, locale);
        
        // 触发语言变更事件
        this.eventEmitter.emit(EVENTS.LOCALE_CHANGED, locale);
        
        return true;
    }

    /**
     * 获取当前语言
     * @returns {string} - 当前语言代码
     */
    getLocale() {
        return this.currentLocale;
    }

    /**
     * 翻译文本
     * @param {string} key - 翻译键
     * @param {Object} params - 插值参数
     * @returns {string} - 翻译结果
     */
    translate(key, params = {}) {
        // 检查资源是否已加载
        if (!this.isLoaded || !this.resources[this.currentLocale]) {
            console.warn('翻译资源未加载，使用原始键');
            return this._interpolate(key, params);
        }

        // 获取当前语言的资源
        const resources = this.resources[this.currentLocale];
        
        // 通过点号分隔的路径获取嵌套属性
        const pathParts = key.split('.');
        let value = resources;
        
        for (const part of pathParts) {
            if (value === undefined || value === null) {
                console.warn(`翻译键无效: ${key}`);
                return key;
            }
            value = value[part];
        }
        
        // 如果找不到翻译，返回原始键
        if (value === undefined || value === null) {
            console.warn(`找不到翻译: ${key}`);
            return key;
        }
        
        // 如果不是字符串，尝试转为字符串
        if (typeof value !== 'string') {
            console.warn(`翻译值不是字符串: ${key} -> ${value}`);
            return String(value);
        }
        
        // 处理插值
        return this._interpolate(value, params);
    }

    /**
     * 处理插值
     * @private
     * @param {string} text - 包含插值占位符的文本
     * @param {Object} params - 插值参数
     * @returns {string} - 处理后的文本
     */
    _interpolate(text, params) {
        if (!params || Object.keys(params).length === 0) {
            return text;
        }
        
        return text.replace(/\{([^{}]+)\}/g, (match, key) => {
            const value = params[key];
            return value !== undefined ? value : match;
        });
    }

    /**
     * 添加语言变更监听器
     * @param {Function} callback - 回调函数
     * @returns {Function} - 移除监听器的函数
     */
    onLocaleChanged(callback) {
        return this.eventEmitter.on(EVENTS.LOCALE_CHANGED, callback);
    }

    /**
     * 添加翻译资源加载监听器
     * @param {Function} callback - 回调函数
     * @returns {Function} - 移除监听器的函数
     */
    onTranslationsLoaded(callback) {
        return this.eventEmitter.on(EVENTS.TRANSLATIONS_LOADED, callback);
    }
} 
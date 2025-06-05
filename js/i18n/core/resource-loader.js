/**
 * 资源加载器
 * 负责加载语言资源文件并注册到I18nManager
 */
import { I18nManager } from './i18n-manager.js';
import { LOCALES } from '../../core/constants.js';

export class ResourceLoader {
    /**
     * 单例模式，获取ResourceLoader实例
     * @returns {ResourceLoader} - ResourceLoader实例
     */
    static getInstance() {
        if (!ResourceLoader._instance) {
            ResourceLoader._instance = new ResourceLoader();
        }
        return ResourceLoader._instance;
    }

    constructor() {
        // 确保单例
        if (ResourceLoader._instance) {
            return ResourceLoader._instance;
        }
        
        this.i18n = I18nManager.getInstance();
        this.loaded = new Set();
        
        // 存储单例
        ResourceLoader._instance = this;
    }

    /**
     * 加载所有语言资源
     * @param {Array<string>} locales - 要加载的语言列表，默认为所有支持的语言
     * @returns {Promise<void>} - 加载完成的Promise
     */
    async loadAllLocales(locales = [LOCALES.ZH_CN, LOCALES.EN_US]) {
        const promises = [];
        
        for (const locale of locales) {
            promises.push(this.loadLocale(locale));
        }
        
        try {
            await Promise.all(promises);
            console.log('所有语言资源加载完成');
        } catch (error) {
            console.error('加载语言资源失败:', error);
        }
    }

    /**
     * 加载单个语言资源
     * @param {string} locale - 语言代码
     * @returns {Promise<boolean>} - 加载结果
     */
    async loadLocale(locale) {
        // 已加载过的语言资源直接跳过
        if (this.loaded.has(locale)) {
            console.log(`语言资源 ${locale} 已加载`);
            return true;
        }
        
        try {
            // 动态导入语言资源
            const module = await this._importLocale(locale);
            
            // 注册到I18nManager
            this.i18n.loadResources(locale, module.default);
            
            // 标记为已加载
            this.loaded.add(locale);
            
            console.log(`语言资源 ${locale} 加载成功`);
            return true;
        } catch (error) {
            console.error(`加载语言资源 ${locale} 失败:`, error);
            return false;
        }
    }

    /**
     * 动态导入语言资源
     * @private
     * @param {string} locale - 语言代码
     * @returns {Promise<Object>} - 导入的模块
     */
    async _importLocale(locale) {
        // 计算相对路径
        const path = `../locales/${locale}.js`;
        
        try {
            return await import(path);
        } catch (error) {
            // 如果导入失败，尝试从不同路径导入
            console.warn(`从路径 ${path} 导入失败，尝试替代路径`);
            
            // 尝试备用路径
            const alternativePath = `./js/i18n/locales/${locale}.js`;
            try {
                return await import(alternativePath);
            } catch (error) {
                throw new Error(`无法加载语言资源 ${locale}: ${error.message}`);
            }
        }
    }

    /**
     * 检查是否所有指定的语言资源都已加载
     * @param {Array<string>} locales - 要检查的语言列表
     * @returns {boolean} - 是否全部加载
     */
    areLocalesLoaded(locales = [LOCALES.ZH_CN, LOCALES.EN_US]) {
        return locales.every(locale => this.loaded.has(locale));
    }

    /**
     * 获取已加载的语言列表
     * @returns {Array<string>} - 已加载的语言代码列表
     */
    getLoadedLocales() {
        return Array.from(this.loaded);
    }
} 
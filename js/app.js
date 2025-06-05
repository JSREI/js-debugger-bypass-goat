/**
 * 应用主入口
 * 负责初始化国际化系统和UI组件
 */
import { I18nManager } from './i18n/core/i18n-manager.js';
import { ResourceLoader } from './i18n/core/resource-loader.js';
import { DOMHandler } from './i18n/core/dom-handler.js';
import { LanguageSwitcher } from './i18n/ui/language-switcher.js';
import { CodeBlockManager } from './ui/code-block.js';
import { ImageViewer } from './ui/image-viewer.js';
import { LOCALES } from './core/constants.js';
// 导入兼容层，确保旧版API兼容
import './compat.js';

/**
 * 初始化应用
 * @returns {Promise<void>} - 初始化完成的Promise
 */
async function initApp() {
    console.log('初始化应用...');
    
    try {
        // 1. 加载国际化资源
        await initI18n();
        
        // 2. 初始化DOM处理器
        initDOMHandler();
        
        // 3. 初始化语言切换器
        initLanguageSwitcher();
        
        // 4. 初始化UI组件
        initUIComponents();
        
        console.log('应用初始化完成');
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
}

/**
 * 初始化国际化系统
 * @returns {Promise<void>} - 初始化完成的Promise
 */
async function initI18n() {
    console.log('初始化国际化系统...');
    
    const resourceLoader = ResourceLoader.getInstance();
    
    try {
        // 加载所有语言资源
        await resourceLoader.loadAllLocales();
        
        console.log('国际化系统初始化完成');
    } catch (error) {
        console.error('国际化系统初始化失败:', error);
    }
}

/**
 * 初始化DOM处理器
 */
function initDOMHandler() {
    console.log('初始化DOM处理器...');
    
    try {
        // 获取DOM处理器实例
        const domHandler = DOMHandler.getInstance();
        
        // 更新DOM
        domHandler.updateDOM();
        
        console.log('DOM处理器初始化完成');
    } catch (error) {
        console.error('DOM处理器初始化失败:', error);
    }
}

/**
 * 初始化语言切换器
 */
function initLanguageSwitcher() {
    console.log('初始化语言切换器...');
    
    try {
        // 获取语言切换器实例
        const languageSwitcher = LanguageSwitcher.getInstance();
        
        // 初始化
        languageSwitcher.init();
        
        console.log('语言切换器初始化完成');
    } catch (error) {
        console.error('语言切换器初始化失败:', error);
    }
}

/**
 * 初始化其他UI组件
 */
function initUIComponents() {
    console.log('初始化UI组件...');
    
    try {
        // 初始化代码块功能
        initCodeBlocks();
        
        // 初始化图片查看功能
        initImageViewer();
        
        console.log('UI组件初始化完成');
    } catch (error) {
        console.error('UI组件初始化失败:', error);
    }
}

/**
 * 初始化代码块功能
 */
function initCodeBlocks() {
    try {
        // 获取代码块管理器实例
        const codeBlockManager = CodeBlockManager.getInstance();
        
        // 初始化
        codeBlockManager.init();
        
        console.log('代码块功能初始化完成');
    } catch (error) {
        console.error('代码块功能初始化失败:', error);
    }
}

/**
 * 初始化图片查看功能
 */
function initImageViewer() {
    try {
        // 获取图片查看器实例
        const imageViewer = ImageViewer.getInstance();
        
        // 初始化
        imageViewer.init();
        
        console.log('图片查看功能初始化完成');
    } catch (error) {
        console.error('图片查看功能初始化失败:', error);
    }
}

/**
 * 导出全局API
 * 这些API将直接挂载到window对象上
 */
function exportGlobalAPI() {
    // 获取I18n实例
    const i18n = I18nManager.getInstance();
    
    // 翻译函数
    window.t = (key, params) => i18n.translate(key, params);
    
    // 语言切换函数
    window.changeLanguage = (locale) => i18n.setLocale(locale);
    
    // 完整的i18n对象，以便高级用法
    window.i18n = {
        translate: (key, params) => i18n.translate(key, params),
        setLocale: (locale) => i18n.setLocale(locale),
        getLocale: () => i18n.getLocale(),
        // 向后兼容旧版本API
        t: (key, params) => i18n.translate(key, params),
        // 允许直接访问核心对象
        domHandler: DOMHandler.getInstance(),
        codeBlockManager: CodeBlockManager.getInstance(),
        imageViewer: ImageViewer.getInstance()
    };
}

// 当DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp().then(exportGlobalAPI);
    });
} else {
    initApp().then(exportGlobalAPI);
} 
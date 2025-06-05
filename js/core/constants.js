/**
 * 常量定义
 * 所有应用中使用的常量都应在此定义
 */

// 事件名称常量
export const EVENTS = {
    // 国际化相关事件
    LOCALE_CHANGED: 'locale_changed',
    TRANSLATIONS_LOADED: 'translations_loaded',
    
    // UI相关事件
    UI_UPDATED: 'ui_updated',
    
    // 测试用例相关事件
    TEST_STARTED: 'test_started',
    TEST_COMPLETED: 'test_completed',
    TEST_FAILED: 'test_failed'
};

// 支持的语言
export const LOCALES = {
    ZH_CN: 'zh-CN',
    EN_US: 'en-US'
};

// 本地存储键
export const STORAGE_KEYS = {
    LOCALE: 'locale'
};

// 测试类型
export const TEST_TYPES = {
    EVAL: 'eval',
    FUNCTION: 'function',
    INTERVAL: 'interval',
    ARRAY: 'array',
    OBJECT: 'object',
    OTHER: 'other'
};

// DOM属性
export const DOM_ATTRS = {
    I18N_KEY: 'data-i18n',
    I18N_PARAMS: 'data-i18n-params',
    I18N_ATTR: 'data-i18n-attr'
};

// 代码块类型
export const CODE_BLOCK_TYPES = {
    DEFAULT: 'default',
    JAVASCRIPT: 'javascript',
    HTML: 'html'
}; 
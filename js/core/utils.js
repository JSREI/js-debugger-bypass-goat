/**
 * 通用工具函数
 * 提供全局可用的辅助函数
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间(ms)
 * @returns {Function} - 防抖处理后的函数
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制(ms)
 * @returns {Function} - 节流处理后的函数
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 安全的JSON解析
 * @param {string} str - 要解析的JSON字符串
 * @param {*} fallback - 解析失败时的返回值
 * @returns {*} - 解析结果或fallback值
 */
export function safeJSONParse(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error('JSON parsing error:', e);
        return fallback;
    }
}

/**
 * 获取浏览器默认语言
 * @returns {string} - 语言代码，如'zh-CN'或'en-US'
 */
export function getBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage || 'en-US';
    if (language.startsWith('zh')) {
        return 'zh-CN';
    }
    return 'en-US';
}

/**
 * 安全地从localStorage读取值
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} - 读取的值或默认值
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (e) {
        console.error('LocalStorage read error:', e);
        return defaultValue;
    }
}

/**
 * 安全地写入localStorage
 * @param {string} key - 存储键
 * @param {*} value - 要存储的值
 * @returns {boolean} - 是否成功
 */
export function setToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.error('LocalStorage write error:', e);
        return false;
    }
}

/**
 * 创建一个唯一ID
 * @returns {string} - 唯一ID字符串
 */
export function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 判断是否为移动设备
 * @returns {boolean} - 是否为移动设备
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 检测浏览器是否支持某个CSS特性
 * @param {string} featureName - CSS特性名称
 * @returns {boolean} - 是否支持
 */
export function supportsCSSFeature(featureName) {
    return featureName in document.documentElement.style;
} 
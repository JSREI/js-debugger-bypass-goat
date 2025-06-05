/**
 * i18n 模块导入管理
 * 
 * 此文件处理所有i18n相关模块的正确加载顺序
 * 使用此文件可以避免手动管理脚本标签的加载顺序
 */

(function() {
    // 防止重复初始化
    if (window.i18nImportsInitialized) {
        console.log('i18n imports已初始化，跳过');
        return;
    }
    
    // 标记为已初始化
    window.i18nImportsInitialized = true;
    
    // 定义加载顺序
    const scripts = [
        'zh-CN.js',           // 中文翻译资源
        'en-US.js',           // 英文翻译资源
        'i18n-base.js',       // i18n基类
        'i18n-core.js',       // i18n核心库
        'i18n-case-processor.js', // 新的测试用例处理器
        'i18n-case-detail.js' // 兼容层
    ];

    // 根据当前脚本路径调整基本路径
    let adjustedBasePath = '';
    
    // 1. 首先尝试从当前脚本标签获取路径
    const currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
        const scriptPath = currentScript.src;
        const lastSlashIndex = scriptPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            adjustedBasePath = scriptPath.substring(0, lastSlashIndex + 1);
        }
    } 
    // 2. 如果无法获取当前脚本路径，尝试从URL路径推断
    else {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/cases/')) {
            adjustedBasePath = '../js/i18n/';
        } else if (currentPath.includes('/test-cases/')) {
            const pathParts = currentPath.split('/');
            // 计算需要回退的目录层级
            const depth = pathParts.length - pathParts.indexOf('test-cases') - 1;
            adjustedBasePath = '../'.repeat(depth) + 'js/i18n/';
        } else {
            adjustedBasePath = 'js/i18n/';
        }
    }
    
    console.log('i18n 模块加载路径:', adjustedBasePath);
    
    // 记录当前已加载的脚本数量
    let loadedScripts = 0;
    // 是否所有脚本都已添加到页面
    let allScriptsAdded = false;
    
    // 标记是否已经初始化过i18n
    let i18nInitialized = false;
    
    // 加载所有脚本
    scripts.forEach((script, index) => {
        // 检查脚本是否已经加载
        const existingScript = document.querySelector(`script[src*="${script}"]`);
        if (existingScript) {
            // 已加载，跳过并增加计数
            console.log(`脚本 ${script} 已存在，跳过加载`);
            loadedScripts++;
            checkAllLoaded();
            return;
        }
        
        // 添加新脚本
        const scriptElement = document.createElement('script');
        scriptElement.src = adjustedBasePath + script;
        scriptElement.async = false; // 确保按顺序执行
        scriptElement.setAttribute('data-i18n-managed', 'true'); // 标记为受管理的脚本
        
        // 当脚本加载完成时
        scriptElement.onload = () => {
            console.log(`脚本 ${script} 加载成功`);
            loadedScripts++;
            checkAllLoaded();
        };
        
        // 加载失败处理
        scriptElement.onerror = (error) => {
            console.error(`加载脚本 ${scriptElement.src} 失败:`, error);
            loadedScripts++;
            checkAllLoaded();
        };
        
        // 添加到页面
        document.head.appendChild(scriptElement);
    });
    
    // 标记所有脚本已添加到页面
    allScriptsAdded = true;
    // 检查是否所有脚本已立即加载完成（可能来自缓存）
    checkAllLoaded();
    
    // 检查是否所有脚本都已加载
    function checkAllLoaded() {
        if (loadedScripts >= scripts.length && allScriptsAdded && !i18nInitialized) {
            // 所有脚本加载完成，初始化i18n
            console.log('所有i18n脚本加载完成');
            i18nInitialized = true;
            
            // 如果页面已经加载完成，立即初始化
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initializeI18n();
            } else {
                // 否则等待DOM加载完成
                document.addEventListener('DOMContentLoaded', initializeI18n);
            }
        }
    }
    
    // 初始化i18n
    function initializeI18n() {
        // 防止重复初始化
        if (window.i18nInstanceInitialized) {
            console.log('i18n实例已初始化，跳过');
            return;
        }
        
        window.i18nInstanceInitialized = true;
        
        try {
            // i18n-core.js 中已经在DOMContentLoaded时创建了实例
            // 这里只做一些额外的检查和初始化
            if (!window.i18nInstance && typeof I18n === 'function') {
                console.log('创建i18n实例');
                window.i18nInstance = new I18n();
            }
        } catch(e) {
            console.error('初始化i18n实例失败:', e);
        }
    }
})(); 
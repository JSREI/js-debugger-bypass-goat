/**
 * 多语言加载器
 * 自动检测测试用例类型，加载对应的多语言处理类
 */
class I18nLoader {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    /**
     * 初始化多语言处理
     */
    init() {
        try {
            // 检查是否存在测试容器
            if (!document.querySelector('.test-container')) {
                console.log('非测试用例页面，不需要加载多语言处理器');
                return;
            }
            
            // 加载对应的处理类
            const handler = this.createHandler();
            if (handler) {
                console.log('加载多语言处理器:', handler.constructor.name);
                handler.update();
            } else {
                console.warn('无法检测到合适的多语言处理器');
            }
        } catch (error) {
            console.error('多语言加载器初始化失败:', error);
        }
    }
    
    /**
     * 根据页面内容创建合适的处理类
     */
    createHandler() {
        const title = document.querySelector('.test-container h2');
        if (!title) return null;
        
        const titleText = title.textContent.trim();
        
        // 根据标题内容返回对应的处理类
        if (titleText.includes('eval') || titleText.toLowerCase().includes('eval')) {
            return new I18nEvalCase(this.i18n);
        } 
        else if (titleText.includes('Function') || titleText.includes('构造函数') && !titleText.includes('数组') && !titleText.includes('对象')) {
            return new I18nFunctionCase(this.i18n);
        }
        else if (titleText.includes('setInterval') || titleText.includes('定时器')) {
            return new I18nIntervalCase(this.i18n);
        }
        else if (titleText.includes('数组') || titleText.includes('Array')) {
            return new I18nArrayCase(this.i18n);
        }
        else if (titleText.includes('对象') || titleText.includes('Object')) {
            return new I18nObjectCase(this.i18n);
        }
        else if (titleText.includes('其他') || titleText.includes('Other')) {
            return new I18nOtherCase(this.i18n);
        }
        
        // 默认处理类：继续使用原有的CaseDetail类作为兼容处理
        console.warn('未能确定测试类型，使用默认处理类');
        return new I18nCaseDetail(this.i18n);
    }
}

// 将加载器添加到I18n对象
document.addEventListener('DOMContentLoaded', () => {
    if (window.i18nInstance) {
        const loader = new I18nLoader(window.i18nInstance);
        
        // 添加对默认语言变更的监听
        window.i18nInstance.addLanguageChangeListener(() => {
            loader.init();
        });
        
        // 初始化
        loader.init();
    } else {
        console.error('i18nInstance 不存在，无法初始化多语言加载器');
    }
});
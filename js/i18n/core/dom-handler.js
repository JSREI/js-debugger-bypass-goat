/**
 * DOM处理器
 * 负责将国际化应用到DOM元素
 */
import { I18nManager } from './i18n-manager.js';
import { DOM_ATTRS, EVENTS } from '../../core/constants.js';
import { debounce, safeJSONParse } from '../../core/utils.js';

export class DOMHandler {
    /**
     * 单例模式，获取DOMHandler实例
     * @returns {DOMHandler} - DOMHandler实例
     */
    static getInstance() {
        if (!DOMHandler._instance) {
            DOMHandler._instance = new DOMHandler();
        }
        return DOMHandler._instance;
    }

    constructor() {
        // 确保单例
        if (DOMHandler._instance) {
            return DOMHandler._instance;
        }

        this.i18n = I18nManager.getInstance();
        
        // 绑定语言变更事件，当语言变更时更新DOM
        this.i18n.onLocaleChanged(() => {
            this.updateDOM();
        });
        
        // 初始化MutationObserver，监听DOM变化
        this._setupMutationObserver();

        // 存储单例
        DOMHandler._instance = this;
    }

    /**
     * 更新整个DOM的国际化
     */
    updateDOM() {
        this._translateElements();
        this._translateAttributes();
        this._updateSpecialElements();

        // 触发UI更新事件
        document.dispatchEvent(new CustomEvent(EVENTS.UI_UPDATED));
    }

    /**
     * 翻译DOM元素
     * @private
     */
    _translateElements() {
        document.querySelectorAll(`[${DOM_ATTRS.I18N_KEY}]`).forEach(el => {
            const key = el.getAttribute(DOM_ATTRS.I18N_KEY);
            const params = this._getElementParams(el);
            
            // 根据元素类型选择不同的处理方式
            if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'button' || el.type === 'submit')) {
                el.value = this.i18n.translate(key, params);
            } else {
                el.textContent = this.i18n.translate(key, params);
            }
        });
    }

    /**
     * 翻译DOM元素的属性
     * @private
     */
    _translateAttributes() {
        document.querySelectorAll(`[${DOM_ATTRS.I18N_ATTR}]`).forEach(el => {
            const attrSpec = el.getAttribute(DOM_ATTRS.I18N_ATTR);
            const specs = attrSpec.split(',').map(s => s.trim());
            
            specs.forEach(spec => {
                const [attrName, key] = spec.split(':').map(s => s.trim());
                if (attrName && key) {
                    el.setAttribute(attrName, this.i18n.translate(key));
                }
            });
        });
    }

    /**
     * 更新特殊元素
     * 处理没有使用标准数据属性的特殊情况
     * @private
     */
    _updateSpecialElements() {
        this._updateNavigationElements();
        this._updateTestButtons();
        this._updateCodeLabels();
        this._updateResultMessages();
        this._updateGuideTitle();
    }

    /**
     * 更新导航元素
     * @private
     */
    _updateNavigationElements() {
        // 处理首页链接
        const homeLinks = document.querySelectorAll('a[href*="index.html"]:not([data-i18n])');
        homeLinks.forEach(link => {
            if (link.textContent.includes('首页') || link.textContent.includes('Home') || 
                link.textContent.includes('nav.home')) {
                const icon = link.querySelector('i');
                link.innerHTML = '';
                if (icon) link.appendChild(icon);
                link.appendChild(document.createTextNode(' ' + this.i18n.translate('nav.home')));
            }
        });

        // 处理测试用例链接
        const caseLinks = document.querySelectorAll('a[href*="cases"]:not([data-i18n])');
        caseLinks.forEach(link => {
            if (link.textContent.includes('测试用例') || link.textContent.includes('Test Cases') || 
                link.textContent.includes('nav.testCases')) {
                const icon = link.querySelector('i');
                link.innerHTML = '';
                if (icon) link.appendChild(icon);
                link.appendChild(document.createTextNode(' ' + this.i18n.translate('nav.testCases')));
            }
        });

        // 处理页脚反馈链接
        const feedbackLinks = document.querySelectorAll('a[href*="issues"]:not([data-i18n])');
        feedbackLinks.forEach(link => {
            if (link.textContent.includes('问题反馈') || link.textContent.includes('Feedback') || 
                link.textContent.includes('footer.feedback')) {
                const icon = link.querySelector('i');
                link.innerHTML = '';
                if (icon) link.appendChild(icon);
                link.appendChild(document.createTextNode(' ' + this.i18n.translate('footer.feedback')));
            }
        });
    }

    /**
     * 更新测试按钮
     * @private
     */
    _updateTestButtons() {
        // 处理测试按钮
        const testButtons = document.querySelectorAll('button[onclick*="runTest"]:not([data-i18n])');
        testButtons.forEach(button => {
            if (button.textContent.includes('开始测试') || button.textContent.includes('Start Test') || 
                button.textContent.includes('testCase.startTest')) {
                button.textContent = this.i18n.translate('testCase.startTest');
            }
        });

        // 处理停止按钮
        const stopButtons = document.querySelectorAll('button[id="stopButton"]:not([data-i18n])');
        stopButtons.forEach(button => {
            button.textContent = this.i18n.translate('testCase.stopTest');
        });

        // 处理测试状态
        const statusElements = document.querySelectorAll('#testStatus:not([data-i18n])');
        statusElements.forEach(element => {
            if (element.textContent.includes('测试运行中') || element.textContent.includes('Test Running')) {
                element.textContent = this.i18n.translate('testCase.testRunning');
            } else if (element.textContent.includes('测试完成') || element.textContent.includes('Test Complete')) {
                element.textContent = this.i18n.translate('testCase.testComplete');
            }
        });
    }

    /**
     * 更新代码标签
     * @private
     */
    _updateCodeLabels() {
        const codeBlocks = document.querySelectorAll('.code-block');
        if (codeBlocks.length === 0) return;

        // 创建或更新样式
        let styleElement = document.querySelector('style[data-i18n-code-label]');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.setAttribute('data-i18n-code-label', 'true');
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            .code-block::before { 
                content: "${this.i18n.translate('testCase.codeLabel')}" !important; 
                position: absolute;
                top: -12px;
                left: 1rem;
                background: var(--primary-color);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.875rem;
            }
        `;
    }

    /**
     * 更新测试结果消息
     * @private
     */
    _updateResultMessages() {
        // 处理成功消息
        const successElements = document.querySelectorAll('#success:not([data-i18n])');
        successElements.forEach(element => {
            const execTime = element.querySelector('#execTime');
            const time = execTime ? execTime.textContent : '0';
            element.innerHTML = this.i18n.translate('testCase.success.title') + 
                '<div class="details">' + 
                this.i18n.translate('testCase.success.detail', {time: '<span id="execTime">' + time + '</span>'}) + 
                '</div>';
        });

        // 处理失败消息
        const failureElements = document.querySelectorAll('#failure:not([data-i18n])');
        failureElements.forEach(element => {
            const execTime = element.querySelector('#execTimeFailure');
            const time = execTime ? execTime.textContent : '0';
            element.innerHTML = this.i18n.translate('testCase.failure.title') + 
                '<div class="details">' + 
                this.i18n.translate('testCase.failure.detail', {time: '<span id="execTimeFailure">' + time + '</span>'}) + 
                '</div>';
        });
    }

    /**
     * 更新测试指南标题
     * @private
     */
    _updateGuideTitle() {
        const guideTitles = document.querySelectorAll('.guide-steps h3:not([data-i18n])');
        guideTitles.forEach(title => {
            const icon = title.querySelector('i');
            title.innerHTML = '';
            if (icon) title.appendChild(icon);
            title.appendChild(document.createTextNode(' ' + this.i18n.translate('testCase.guide.title')));
        });
    }

    /**
     * 获取元素参数
     * @private
     * @param {Element} element - DOM元素
     * @returns {Object} - 参数对象
     */
    _getElementParams(element) {
        const paramsAttr = element.getAttribute(DOM_ATTRS.I18N_PARAMS);
        if (!paramsAttr) {
            return {};
        }
        
        return safeJSONParse(paramsAttr, {});
    }

    /**
     * 设置MutationObserver
     * @private
     */
    _setupMutationObserver() {
        const observer = new MutationObserver(debounce((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach(mutation => {
                // 检查是否有新节点被添加
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    shouldUpdate = true;
                }
                
                // 检查是否有属性变化
                if (mutation.type === 'attributes' && 
                   (mutation.attributeName === DOM_ATTRS.I18N_KEY || 
                    mutation.attributeName === DOM_ATTRS.I18N_PARAMS || 
                    mutation.attributeName === DOM_ATTRS.I18N_ATTR)) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                this._translateNewElements(mutations);
            }
        }, 200));
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [DOM_ATTRS.I18N_KEY, DOM_ATTRS.I18N_PARAMS, DOM_ATTRS.I18N_ATTR]
        });
    }

    /**
     * 翻译新添加的元素
     * @private
     * @param {MutationRecord[]} mutations - 变化记录
     */
    _translateNewElements(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 处理新添加的元素
                        if (node.hasAttribute && node.hasAttribute(DOM_ATTRS.I18N_KEY)) {
                            const key = node.getAttribute(DOM_ATTRS.I18N_KEY);
                            const params = this._getElementParams(node);
                            
                            if (node.tagName === 'INPUT' && (node.type === 'text' || node.type === 'button' || node.type === 'submit')) {
                                node.value = this.i18n.translate(key, params);
                            } else {
                                node.textContent = this.i18n.translate(key, params);
                            }
                        }
                        
                        if (node.hasAttribute && node.hasAttribute(DOM_ATTRS.I18N_ATTR)) {
                            const attrSpec = node.getAttribute(DOM_ATTRS.I18N_ATTR);
                            const specs = attrSpec.split(',').map(s => s.trim());
                            
                            specs.forEach(spec => {
                                const [attrName, key] = spec.split(':').map(s => s.trim());
                                if (attrName && key) {
                                    node.setAttribute(attrName, this.i18n.translate(key));
                                }
                            });
                        }
                        
                        // 检查子元素
                        if (node.querySelectorAll) {
                            const childElements = node.querySelectorAll(`[${DOM_ATTRS.I18N_KEY}], [${DOM_ATTRS.I18N_ATTR}]`);
                            if (childElements.length) {
                                this._translateElements();
                                this._translateAttributes();
                            }
                        }
                    }
                });
            } 
            else if (mutation.type === 'attributes') {
                const node = mutation.target;
                
                if (mutation.attributeName === DOM_ATTRS.I18N_KEY) {
                    const key = node.getAttribute(DOM_ATTRS.I18N_KEY);
                    const params = this._getElementParams(node);
                    
                    if (node.tagName === 'INPUT' && (node.type === 'text' || node.type === 'button' || node.type === 'submit')) {
                        node.value = this.i18n.translate(key, params);
                    } else {
                        node.textContent = this.i18n.translate(key, params);
                    }
                } 
                else if (mutation.attributeName === DOM_ATTRS.I18N_ATTR) {
                    const attrSpec = node.getAttribute(DOM_ATTRS.I18N_ATTR);
                    const specs = attrSpec.split(',').map(s => s.trim());
                    
                    specs.forEach(spec => {
                        const [attrName, key] = spec.split(':').map(s => s.trim());
                        if (attrName && key) {
                            node.setAttribute(attrName, this.i18n.translate(key));
                        }
                    });
                } 
                else if (mutation.attributeName === DOM_ATTRS.I18N_PARAMS) {
                    if (node.hasAttribute(DOM_ATTRS.I18N_KEY)) {
                        const key = node.getAttribute(DOM_ATTRS.I18N_KEY);
                        const params = this._getElementParams(node);
                        
                        if (node.tagName === 'INPUT' && (node.type === 'text' || node.type === 'button' || node.type === 'submit')) {
                            node.value = this.i18n.translate(key, params);
                        } else {
                            node.textContent = this.i18n.translate(key, params);
                        }
                    }
                }
            }
        });
        
        // 处理特殊元素
        this._updateSpecialElements();
    }
} 
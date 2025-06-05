/**
 * 语言切换器组件
 * 提供语言切换UI及其功能
 */
import { I18nManager } from '../core/i18n-manager.js';
import { LOCALES } from '../../core/constants.js';

export class LanguageSwitcher {
    /**
     * 单例模式，获取LanguageSwitcher实例
     * @returns {LanguageSwitcher} - LanguageSwitcher实例
     */
    static getInstance() {
        if (!LanguageSwitcher._instance) {
            LanguageSwitcher._instance = new LanguageSwitcher();
        }
        return LanguageSwitcher._instance;
    }

    constructor() {
        // 确保单例
        if (LanguageSwitcher._instance) {
            return LanguageSwitcher._instance;
        }
        
        // 获取i18n实例
        this.i18n = I18nManager.getInstance();
        
        // 初始化标志
        this.initialized = false;
        
        // 存储单例
        LanguageSwitcher._instance = this;
    }

    /**
     * 初始化语言切换器
     * @returns {LanguageSwitcher} - 链式调用
     */
    init() {
        // 避免重复初始化
        if (this.initialized) {
            return this;
        }
        
        // 查找现有的语言切换器元素
        const existingSwitcher = document.getElementById('lang-switcher-wrapper');
        if (existingSwitcher) {
            this._setupExistingSwitcher(existingSwitcher);
        } else {
            this._createSwitcher();
        }
        
        // 绑定语言变更事件
        this.i18n.onLocaleChanged(() => {
            this.updateUI();
        });
        
        this.initialized = true;
        
        return this;
    }

    /**
     * 更新语言切换器UI
     */
    updateUI() {
        const currentLocale = this.i18n.getLocale();
        const options = document.querySelectorAll('.lang-option');
        
        options.forEach(option => {
            const locale = option.getAttribute('data-lang');
            
            if (locale === currentLocale) {
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
                if (icon) {
                    option.removeChild(icon);
                }
            }
        });
    }

    /**
     * 设置已存在的语言切换器
     * @private
     * @param {HTMLElement} switcherWrapper - 切换器容器元素
     */
    _setupExistingSwitcher(switcherWrapper) {
        // 获取语言选项
        const zhOption = document.getElementById('lang-zh');
        const enOption = document.getElementById('lang-en');
        
        if (zhOption) {
            zhOption.addEventListener('click', () => this._changeLanguage(LOCALES.ZH_CN));
        }
        
        if (enOption) {
            enOption.addEventListener('click', () => this._changeLanguage(LOCALES.EN_US));
        }
        
        this.updateUI();
    }

    /**
     * 创建新的语言切换器
     * @private
     */
    _createSwitcher() {
        // 创建切换器容器
        const switcherWrapper = document.createElement('div');
        switcherWrapper.id = 'lang-switcher-wrapper';
        switcherWrapper.style.margin = '0 15px';
        
        // 创建切换器
        const switcher = document.createElement('div');
        switcher.id = 'lang-switcher';
        switcher.style.display = 'flex';
        switcher.style.background = '#f0f0f0';
        switcher.style.borderRadius = '8px';
        switcher.style.overflow = 'hidden';
        
        // 创建中文选项
        const zhOption = document.createElement('div');
        zhOption.id = 'lang-zh';
        zhOption.className = 'lang-option';
        zhOption.setAttribute('data-lang', LOCALES.ZH_CN);
        zhOption.style.padding = '8px 10px';
        zhOption.style.cursor = 'pointer';
        zhOption.style.display = 'flex';
        zhOption.style.alignItems = 'center';
        zhOption.textContent = '简体中文';
        zhOption.addEventListener('click', () => this._changeLanguage(LOCALES.ZH_CN));
        
        // 创建英文选项
        const enOption = document.createElement('div');
        enOption.id = 'lang-en';
        enOption.className = 'lang-option';
        enOption.setAttribute('data-lang', LOCALES.EN_US);
        enOption.style.padding = '8px 10px';
        enOption.style.cursor = 'pointer';
        enOption.style.display = 'flex';
        enOption.style.alignItems = 'center';
        enOption.textContent = 'English';
        enOption.addEventListener('click', () => this._changeLanguage(LOCALES.EN_US));
        
        // 组装切换器
        switcher.appendChild(zhOption);
        switcher.appendChild(enOption);
        switcherWrapper.appendChild(switcher);
        
        // 插入到DOM中
        this._insertSwitcherToDom(switcherWrapper);
        
        // 更新UI以反映当前语言
        this.updateUI();
    }

    /**
     * 将切换器插入到DOM中的适当位置
     * @private
     * @param {HTMLElement} switcherWrapper - 切换器容器元素
     */
    _insertSwitcherToDom(switcherWrapper) {
        // 尝试找到导航栏右侧区域
        const navRight = document.querySelector('.nav-right');
        
        if (navRight) {
            // 找到GitHub链接，如果有的话，将切换器插入到它前面
            const githubLink = navRight.querySelector('.github-link');
            if (githubLink) {
                navRight.insertBefore(switcherWrapper, githubLink);
            } else {
                navRight.appendChild(switcherWrapper);
            }
        } else {
            // 如果找不到导航栏右侧区域，直接插入到header中
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(switcherWrapper);
            } else {
                // 如果连header都找不到，只能插入到body开头了
                document.body.insertBefore(switcherWrapper, document.body.firstChild);
            }
        }
    }

    /**
     * 切换语言
     * @private
     * @param {string} locale - 目标语言
     */
    _changeLanguage(locale) {
        if (this.i18n.setLocale(locale)) {
            console.log(`语言已切换为: ${locale}`);
        } else {
            console.error(`切换语言失败: ${locale}`);
        }
    }
} 
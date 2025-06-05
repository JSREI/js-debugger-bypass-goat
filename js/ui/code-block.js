/**
 * 代码块组件
 * 处理代码块的显示和交互
 */
import { I18nManager } from '../i18n/core/i18n-manager.js';

export class CodeBlockManager {
    /**
     * 单例模式，获取CodeBlockManager实例
     * @returns {CodeBlockManager} - CodeBlockManager实例
     */
    static getInstance() {
        if (!CodeBlockManager._instance) {
            CodeBlockManager._instance = new CodeBlockManager();
        }
        return CodeBlockManager._instance;
    }

    constructor() {
        // 确保单例
        if (CodeBlockManager._instance) {
            return CodeBlockManager._instance;
        }

        this.i18n = I18nManager.getInstance();
        this.initialized = false;
        
        // 存储单例
        CodeBlockManager._instance = this;
    }

    /**
     * 初始化代码块功能
     * @returns {CodeBlockManager} - 链式调用
     */
    init() {
        // 避免重复初始化
        if (this.initialized) {
            return this;
        }
        
        // 为所有代码块添加复制功能
        this._addCopyButtons();
        
        this.initialized = true;
        return this;
    }

    /**
     * 添加复制按钮到所有代码块
     * @private
     */
    _addCopyButtons() {
        document.querySelectorAll('.code-block').forEach(block => {
            // 检查是否已有复制按钮
            if (block.parentNode.querySelector('.copy-button')) {
                return;
            }
            
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'button copy-button';
            copyButton.style.float = 'right';
            copyButton.style.padding = '0.25rem 0.5rem';
            copyButton.style.fontSize = '0.875rem';
            copyButton.textContent = this.i18n.translate('common.copyCode');
            
            // 添加复制功能
            copyButton.addEventListener('click', () => {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = this.i18n.translate('common.copied');
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                });
            });

            // 添加到DOM
            block.parentNode.insertBefore(copyButton, block);
        });
    }

    /**
     * 刷新所有代码块
     * 当DOM内容发生变化时，可以调用此方法重新初始化新添加的代码块
     */
    refresh() {
        this._addCopyButtons();
    }
} 
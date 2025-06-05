/**
 * 图片查看器组件
 * 处理图片查看和放大功能
 */
import { I18nManager } from '../i18n/core/i18n-manager.js';

export class ImageViewer {
    /**
     * 单例模式，获取ImageViewer实例
     * @returns {ImageViewer} - ImageViewer实例
     */
    static getInstance() {
        if (!ImageViewer._instance) {
            ImageViewer._instance = new ImageViewer();
        }
        return ImageViewer._instance;
    }

    constructor() {
        // 确保单例
        if (ImageViewer._instance) {
            return ImageViewer._instance;
        }

        this.i18n = I18nManager.getInstance();
        this.modal = null;
        this.modalImg = null;
        this.closeBtn = null;
        this.modalOverlay = null;
        this.initialized = false;
        
        // 存储单例
        ImageViewer._instance = this;
    }

    /**
     * 初始化图片查看器
     * @returns {ImageViewer} - 链式调用
     */
    init() {
        // 避免重复初始化
        if (this.initialized) {
            return this;
        }
        
        // 创建或获取模态框
        this._setupModal();
        
        // 为所有可放大图片添加事件
        this._setupImages();
        
        this.initialized = true;
        return this;
    }

    /**
     * 设置模态框
     * @private
     */
    _setupModal() {
        // 查找或创建模态框
        this.modal = document.querySelector('.image-modal');
        
        if (!this.modal) {
            // 创建模态框
            this.modal = document.createElement('div');
            this.modal.className = 'image-modal';
            
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.className = 'modal-overlay';
            
            const content = document.createElement('div');
            content.className = 'modal-content';
            
            this.modalImg = document.createElement('img');
            content.appendChild(this.modalImg);
            
            this.closeBtn = document.createElement('button');
            this.closeBtn.className = 'close-modal';
            this.closeBtn.innerHTML = '&times;';
            
            content.appendChild(this.closeBtn);
            this.modal.appendChild(this.modalOverlay);
            this.modal.appendChild(content);
            
            document.body.appendChild(this.modal);
            
            // 添加样式
            this._addStyles();
        } else {
            this.modalImg = this.modal.querySelector('img');
            this.closeBtn = this.modal.querySelector('.close-modal');
            this.modalOverlay = this.modal.querySelector('.modal-overlay');
        }
        
        // 添加关闭事件
        this._setupCloseEvents();
    }

    /**
     * 为所有可放大图片设置事件
     * @private
     */
    _setupImages() {
        document.querySelectorAll('.zoomable-image').forEach(img => {
            img.addEventListener('click', () => {
                this.openImage(img.src);
            });
        });
    }

    /**
     * 设置关闭事件
     * @private
     */
    _setupCloseEvents() {
        // 点击关闭按钮关闭模态框
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // 点击遮罩层关闭模态框
        this.modalOverlay.addEventListener('click', () => this.closeModal());
        
        // 按ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    /**
     * 添加样式
     * @private
     */
    _addStyles() {
        const styleExists = document.querySelector('style[data-image-viewer]');
        if (styleExists) return;

        const style = document.createElement('style');
        style.setAttribute('data-image-viewer', 'true');
        style.textContent = `
            .image-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }

            .image-modal.show {
                display: block;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 90%;
                max-height: 90%;
            }

            .modal-content img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
            }

            .close-modal {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 32px;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }

            .close-modal:hover {
                transform: scale(1.1);
            }

            .zoomable-image {
                cursor: zoom-in;
                transition: transform 0.2s;
            }

            .zoomable-image:hover {
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 打开图片
     * @param {string} src - 图片链接
     */
    openImage(src) {
        if (!this.initialized) {
            this.init();
        }
        
        this.modal.classList.add('show');
        this.modalImg.src = src;
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
    }

    /**
     * 刷新图片查看器
     * 当DOM内容发生变化时，可以调用此方法重新绑定新添加的图片
     */
    refresh() {
        this._setupImages();
    }
} 
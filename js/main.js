// 通用功能
document.addEventListener('DOMContentLoaded', () => {
    // 为所有代码块添加复制功能
    document.querySelectorAll('.code-block').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'button';
        copyButton.style.float = 'right';
        copyButton.style.padding = '0.25rem 0.5rem';
        copyButton.style.fontSize = '0.875rem';
        copyButton.textContent = '复制代码';
        
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = '已复制！';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            });
        });

        block.parentNode.insertBefore(copyButton, block);
    });

    // 图片查看功能
    const modal = document.querySelector('.image-modal');
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');

    // 为所有可放大的图片添加点击事件
    document.querySelectorAll('.zoomable-image').forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.add('show');
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });

    // 点击关闭按钮关闭模态框
    closeBtn.addEventListener('click', closeModal);

    // 点击遮罩层关闭模态框
    modalOverlay.addEventListener('click', closeModal);

    // 按ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
});

// 添加样式
const style = document.createElement('style');
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
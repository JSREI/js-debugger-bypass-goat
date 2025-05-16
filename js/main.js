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
}); 
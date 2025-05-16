class I18nHome {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    update() {
        // 检查是否在首页
        if (!document.querySelector('.hero')) return;
        
        // 更新 hero 部分
        const heroBadge = document.querySelector('.hero-badge span');
        if (heroBadge) heroBadge.textContent = this.i18n.t('hero.badge');
        
        const heroTitle = document.querySelector('.hero h2');
        if (heroTitle) heroTitle.textContent = this.i18n.t('hero.title');
        
        const heroDesc = document.querySelector('.hero p');
        if (heroDesc) heroDesc.textContent = this.i18n.t('hero.description');
        
        const startTest = document.querySelector('.hero .cta-buttons .button:first-child');
        if (startTest) {
            const icon = startTest.querySelector('i');
            startTest.innerHTML = '';
            if (icon) startTest.appendChild(icon);
            startTest.appendChild(document.createTextNode(' ' + this.i18n.t('hero.startTest')));
        }
        
        const viewSource = document.querySelector('.hero .cta-buttons .button.outline');
        if (viewSource) {
            const icon = viewSource.querySelector('i');
            viewSource.innerHTML = '';
            if (icon) viewSource.appendChild(icon);
            viewSource.appendChild(document.createTextNode(' ' + this.i18n.t('hero.viewSource')));
        }
        
        // 更新中间CTA部分
        const ctaBadgeElement = document.querySelector('.cta .section-badge');
        if (ctaBadgeElement) {
            // 保存图标元素
            const iconElement = ctaBadgeElement.querySelector('i');
            // 清空内容
            ctaBadgeElement.innerHTML = '';
            // 重新添加图标
            if (iconElement) ctaBadgeElement.appendChild(iconElement);
            // 添加翻译后的文本
            ctaBadgeElement.appendChild(document.createTextNode(' ' + this.i18n.t('button.startUsing')));
        }
        
        const ctaTitle = document.querySelector('.cta h3');
        if (ctaTitle) ctaTitle.textContent = this.i18n.t('cta.title');
        
        const ctaDesc = document.querySelector('.cta .cta-content > p');
        if (ctaDesc) ctaDesc.textContent = this.i18n.t('cta.description');
        
        const ctaButton = document.querySelector('.cta .cta-buttons .button');
        if (ctaButton) {
            const icon = ctaButton.querySelector('i');
            ctaButton.innerHTML = '';
            if (icon) ctaButton.appendChild(icon);
            ctaButton.appendChild(document.createTextNode(' ' + this.i18n.t('cta.startTest')));
        }
        
        // 更新工作流程部分
        const workflowBadgeElement = document.querySelector('.workflow .section-badge');
        if (workflowBadgeElement) {
            // 保存图标元素
            const iconElement = workflowBadgeElement.querySelector('i');
            // 清空内容
            workflowBadgeElement.innerHTML = '';
            // 重新添加图标
            if (iconElement) workflowBadgeElement.appendChild(iconElement);
            // 添加翻译后的文本
            workflowBadgeElement.appendChild(document.createTextNode(' ' + this.i18n.t('workflow.subtitle')));
        }
        
        const workflowTitle = document.querySelector('.workflow .section-badge + h2');
        if (workflowTitle) workflowTitle.textContent = this.i18n.t('workflow.title');
        
        const workflowDesc = document.querySelector('.workflow .section-header p');
        if (workflowDesc) workflowDesc.textContent = this.i18n.t('workflow.description');
        
        const steps = document.querySelectorAll('.workflow-step');
        if (steps.length >= 3) {
            steps[0].querySelector('h3').textContent = this.i18n.t('workflow.steps.step1.title');
            steps[0].querySelector('p').textContent = this.i18n.t('workflow.steps.step1.description');
            steps[1].querySelector('h3').textContent = this.i18n.t('workflow.steps.step2.title');
            steps[1].querySelector('p').textContent = this.i18n.t('workflow.steps.step2.description');
            steps[2].querySelector('h3').textContent = this.i18n.t('workflow.steps.step3.title');
            steps[2].querySelector('p').textContent = this.i18n.t('workflow.steps.step3.description');
        }
        
        // 更新加入群组部分
        const joinGroupTitle = document.querySelector('.join-group h2');
        if (joinGroupTitle) joinGroupTitle.textContent = this.i18n.t('joinGroup.title');
        
        const qrCodes = document.querySelectorAll('.qr-code p');
        if (qrCodes.length >= 3) {
            qrCodes[0].textContent = this.i18n.t('joinGroup.reverseGroup');
            qrCodes[1].textContent = this.i18n.t('joinGroup.wechat');
            
            // 对于第三个 QR 码，我们需要小心处理，因为它包含一个链接
            const telegramText = qrCodes[2].childNodes[0];
            if (telegramText) {
                telegramText.textContent = this.i18n.t('joinGroup.telegram') + ' ';
            }

            // 更新"点此加入"链接文本
            const telegramLink = qrCodes[2].querySelector('a');
            if (telegramLink) {
                telegramLink.textContent = this.i18n.t('joinGroup.click_to_join');
            }
        }
    }
} 
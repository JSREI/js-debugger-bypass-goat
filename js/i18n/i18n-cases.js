class I18nCases {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    update() {
        // 检查是否在测试用例列表页面
        const casesPageHeader = document.querySelector('.cases-container .section-header');
        if (!casesPageHeader) return;
        
        // 更新页面标题
        document.title = this.i18n.t('casesPage.title');
        
        // 更新测试用例badge
        const casesPageBadge = document.querySelector('.cases-container .section-badge');
        if (casesPageBadge) {
            const iconElement = casesPageBadge.querySelector('i');
            casesPageBadge.innerHTML = '';
            if (iconElement) casesPageBadge.appendChild(iconElement);
            casesPageBadge.appendChild(document.createTextNode(' ' + this.i18n.t('casesPage.badge')));
        }
        
        // 更新测试用例标题和描述
        const casesPageTitle = document.querySelector('.cases-container .section-header h2');
        if (casesPageTitle) casesPageTitle.textContent = this.i18n.t('casesPage.heading');
        
        const casesPageDesc = document.querySelector('.cases-container .section-header p');
        if (casesPageDesc) casesPageDesc.textContent = this.i18n.t('casesPage.description');
        
        // 更新类别标题 - 改进选择器和匹配方式
        const categoryHeaders = document.querySelectorAll('.case-category h2');
        if (categoryHeaders && categoryHeaders.length > 0) {
            // 遍历所有类别标题
            categoryHeaders.forEach(header => {
                const headerText = header.textContent.trim();
                const icon = header.querySelector('i');
                
                // 基础执行模式
                if (headerText.includes('基础执行') || headerText.includes('Basic Execution')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.basic'));
                }
                // 定时器模式
                else if (headerText.includes('定时器') || headerText.includes('Timer')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.timer'));
                }
                // 构造函数模式
                else if (headerText.includes('构造函数') || headerText.includes('Constructor')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.constructor'));
                }
                // 在线网站测试
                else if (headerText.includes('在线网站') || headerText.includes('Online Site')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.online'));
                }
                // 工具网站测试
                else if (headerText.includes('工具网站') || headerText.includes('Tool Site')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.tools'));
                }
                // 其他模式
                else if (headerText.includes('其他') || headerText.includes('Other')) {
                    this.updateCategoryHeader(header, icon, this.i18n.t('casesPage.categories.other'));
                }
            });
        }
        
        // 更新贡献区域
        const contributeTitle = document.querySelector('.contribute-section h3');
        if (contributeTitle) contributeTitle.textContent = this.i18n.t('casesPage.contribute.title');
        
        const contributeDesc = document.querySelector('.contribute-section p');
        if (contributeDesc) contributeDesc.textContent = this.i18n.t('casesPage.contribute.description');
        
        const newCaseBtn = document.querySelector('.contribute-buttons a:nth-child(1)');
        if (newCaseBtn) {
            const icon = newCaseBtn.querySelector('i');
            newCaseBtn.innerHTML = '';
            if (icon) newCaseBtn.appendChild(icon);
            newCaseBtn.appendChild(document.createTextNode(' ' + this.i18n.t('casesPage.contribute.newCase')));
        }
        
        const submitPRBtn = document.querySelector('.contribute-buttons a:nth-child(2)');
        if (submitPRBtn) {
            const icon = submitPRBtn.querySelector('i');
            submitPRBtn.innerHTML = '';
            if (icon) submitPRBtn.appendChild(icon);
            submitPRBtn.appendChild(document.createTextNode(' ' + this.i18n.t('casesPage.contribute.submitPR')));
        }
        
        // 更新测试用例列表中的内容
        this.updateTestCaseItems();
    }
    
    // 辅助方法：更新类别标题
    updateCategoryHeader(header, icon, text) {
        header.innerHTML = '';
        if (icon) header.appendChild(icon);
        header.appendChild(document.createTextNode(' ' + text));
    }
    
    // 更新测试用例内容
    updateTestCaseItems() {
        // 获取所有测试用例项
        const caseItems = document.querySelectorAll('.case-item');
        if (!caseItems || caseItems.length === 0) return;
        
        // 为每个测试用例项更新名称和描述
        caseItems.forEach(item => {
            const caseName = item.querySelector('.case-name');
            const caseDesc = item.querySelector('.case-description');
            const caseBadge = item.querySelector('.case-badge');
            
            // 根据当前测试用例的文本内容确定其类型，并设置相应的翻译
            if (caseName) {
                const nameText = caseName.textContent.trim();
                
                // 处理eval执行测试用例
                if (nameText.includes('eval') || nameText.includes('Eval')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? 'eval 执行' : 'eval Execution';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用 eval 函数执行 debugger 语句' 
                            : 'Execute debugger statement using eval function';
                    }
                }
                // 处理Function构造函数测试用例
                else if (nameText.includes('Function') || nameText.includes('构造函数')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? 'Function 构造函数' : 'Function Constructor';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用 Function 构造函数执行 debugger 语句' 
                            : 'Execute debugger statement using Function constructor';
                    }
                }
                // 处理setInterval基础测试用例
                else if (nameText.includes('setInterval') && nameText.includes('基础')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 基础' : 'Basic setInterval';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用 setInterval 循环执行 debugger 语句' 
                            : 'Execute debugger statement in a loop using setInterval';
                    }
                }
                // 处理setInterval高级测试用例
                else if (nameText.includes('setInterval') && nameText.includes('高级')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 高级' : 'Advanced setInterval';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用 setInterval 的高级变体执行 debugger 语句' 
                            : 'Execute debugger statement using advanced variants of setInterval';
                    }
                }
                // 处理数组构造函数测试用例
                else if (nameText.includes('数组') || nameText.toLowerCase().includes('array')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? '数组构造函数' : 'Array Constructor';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用数组的构造函数链执行 debugger 语句' 
                            : 'Execute debugger statement using array constructor chain';
                    }
                }
                // 处理对象构造函数测试用例
                else if (nameText.includes('对象') || nameText.toLowerCase().includes('object')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? '对象构造函数' : 'Object Constructor';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '使用对象的构造函数执行 debugger 语句' 
                            : 'Execute debugger statement using object constructor';
                    }
                }
                // 处理JSON.CN测试用例
                else if (nameText.includes('JSON.CN')) {
                    caseName.textContent = 'JSON.CN';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? 'JSON.CN 网站的调试检测绕过测试' 
                            : 'Debugger detection bypass test for JSON.CN website';
                    }
                }
                // 处理JavaScript混淆工具测试用例
                else if (nameText.includes('混淆') || nameText.toLowerCase().includes('obfuscator')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? 'JavaScript 混淆工具' : 'JavaScript Obfuscator Tool';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? 'JavaScript 混淆工具网站的调试检测绕过测试' 
                            : 'Debugger detection bypass test for JavaScript Obfuscator Tool website';
                    }
                }
                // 处理其他测试用例
                else if (nameText.includes('其他') || nameText.toLowerCase().includes('other')) {
                    caseName.textContent = this.i18n.currentLang === 'zh-CN' ? '其他测试用例' : 'Other Test Cases';
                    if (caseDesc) {
                        caseDesc.textContent = this.i18n.currentLang === 'zh-CN' 
                            ? '其他类型的 debugger 语句执行测试' 
                            : 'Tests for other types of debugger statement execution';
                    }
                }
            }
            
            // 更新测试用例徽章 - 改进徽章文本处理
            if (caseBadge) {
                // 提取徽章内容，去除图标
                const iconElement = caseBadge.querySelector('i');
                let badgeText = caseBadge.textContent.trim();
                
                // 直接处理所有可能的徽章类型
                if (badgeText.includes('基础测试') || badgeText.includes('Basic Test')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '基础测试' : 'Basic Test');
                }
                else if (badgeText.includes('定时器') || badgeText.includes('Timer')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '定时器' : 'Timer');
                }
                else if (badgeText.includes('构造函数') || badgeText.includes('Constructor')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '构造函数' : 'Constructor');
                }
                else if (badgeText.includes('在线网站') || badgeText.includes('Online Site')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '在线网站' : 'Online Site');
                }
                else if (badgeText.includes('工具网站') || badgeText.includes('Tool Site')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '工具网站' : 'Tool Site');
                }
                else if (badgeText.includes('其他') || badgeText.includes('Other')) {
                    this.updateBadge(caseBadge, iconElement, this.i18n.currentLang === 'zh-CN' ? '其他' : 'Other');
                }
            }
        });
    }
    
    // 辅助方法：更新徽章内容
    updateBadge(badge, icon, text) {
        badge.innerHTML = '';
        if (icon) badge.appendChild(icon);
        badge.appendChild(document.createTextNode(text));
    }
} 
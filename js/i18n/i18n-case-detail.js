class I18nCaseDetail {
    constructor(i18n) {
        this.i18n = i18n;
    }
    
    update() {
        // 检查是否在测试用例详情页面
        const testCaseContainer = document.querySelector('.test-container');
        if (!testCaseContainer) return;
        
        // 更新测试用例标题和描述
        const testTitle = document.querySelector('.test-container h2');
        if (!testTitle) return;
        
        // 根据标题文本确定测试用例类型并更新相应内容
        this.updateCaseTitle(testTitle);
        this.updateCaseDescription();
        
        // 更新测试指南标题和步骤
        this.updateGuideTitle();
        this.updateGuideSteps();
        
        // 更新代码区标签
        this.updateCodeLabel();
        
        // 更新按钮和状态文本
        this.updateButtons();
        
        // 更新成功和失败消息
        this.updateResultMessages();
        
        // 更新页面中的按钮标签
        this.updateTestCaseButtons();
        
        // 强制替换所有JavaScript中的硬编码状态文本
        this.patchJavaScriptTexts();
        
        // 在DOM加载完成后动态处理"测试完成"的显示
        setTimeout(() => {
            const resultMessage = document.querySelector('.result-message');
            if (resultMessage && resultMessage.textContent.includes('测试完成')) {
                resultMessage.textContent = this.i18n.t('testCase.testComplete');
            }
            
            // 更新停止测试按钮
            const stopButton = document.getElementById('stopButton');
            if (stopButton) {
                stopButton.textContent = this.i18n.currentLang === 'zh-CN' ? '停止测试' : 'Stop Test';
            }
            
            // 替换导航菜单中的文本
            this.updateNavigation();
        }, 100);
    }
    
    // 替换导航菜单中的文本
    updateNavigation() {
        // 处理顶部导航链接
        const homeLink = document.querySelector('a[href="../../index.html"]');
        if (homeLink) {
            const icon = homeLink.querySelector('i');
            homeLink.innerHTML = '';
            if (icon) homeLink.appendChild(icon);
            homeLink.appendChild(document.createTextNode(' ' + this.i18n.t('nav.home')));
        }
        
        const casesLink = document.querySelector('a[href="../../cases/index.html"]');
        if (casesLink) {
            const icon = casesLink.querySelector('i');
            casesLink.innerHTML = '';
            if (icon) casesLink.appendChild(icon);
            casesLink.appendChild(document.createTextNode(' ' + this.i18n.t('nav.testCases')));
        }
        
        // 处理页脚"问题反馈"链接
        const feedbackLink = document.querySelector('.footer-links a[href*="issues"]');
        if (feedbackLink) {
            const icon = feedbackLink.querySelector('i');
            feedbackLink.innerHTML = '';
            if (icon) feedbackLink.appendChild(icon);
            feedbackLink.appendChild(document.createTextNode(' ' + this.i18n.t('footer.feedback')));
        }
    }
    
    // 替换JavaScript中的硬编码中文文本
    patchJavaScriptTexts() {
        // 获取当前语言，保存为常量
        const currentLang = this.i18n.currentLang;
        
        // 直接替换脚本中的常见状态文本
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            // 只处理包含中文或状态文本的脚本
            if (script.textContent.includes('测试') || 
                script.textContent.includes('运行中') || 
                script.textContent.includes('完成') ||
                script.textContent.includes('停止') ||
                script.textContent.includes('断点')) {
                
                // 创建一个新的脚本元素，替换原始脚本中的状态文本
                const newScript = document.createElement('script');
                let newContent = script.textContent;
                
                // 替换常见状态文本
                newContent = newContent.replace(/['"]测试运行中\.\.\.['"]|['"]测试运行中...['"]|['"]Test Running...['"]/, 
                    `(window.currentLang === 'zh-CN' ? '测试运行中...' : 'Test Running...')`);
                    
                newContent = newContent.replace(/['"]测试完成['"]|['"]Test Complete['"]/, 
                    `(window.currentLang === 'zh-CN' ? '测试完成' : 'Test Complete')`);
                
                newContent = newContent.replace(/['"]开始测试['"]|['"]Start Test['"]/, 
                    `(window.currentLang === 'zh-CN' ? '开始测试' : 'Start Test')`);
                    
                // setInterval特有的文本
                if (document.querySelector('.test-container h2')?.textContent.includes('setInterval')) {
                    newContent = newContent.replace(/['"]测试期间未检测到任何断点暂停\.['"]|['"]测试期间未检测到任何断点暂停。['"]/, 
                        `(window.currentLang === 'zh-CN' ? '测试期间未检测到任何断点暂停。' : 'No breakpoint pauses detected during the test.')`);
                        
                    newContent = newContent.replace(/['"]测试期间检测到执行被断点中断\.['"]|['"]测试期间检测到执行被断点中断。['"]/, 
                        `(window.currentLang === 'zh-CN' ? '测试期间检测到执行被断点中断。' : 'Execution was interrupted by a breakpoint during the test.')`);
                        
                    newContent = newContent.replace(/['"]停止测试['"]|['"]Stop Test['"]/, 
                        `(window.currentLang === 'zh-CN' ? '停止测试' : 'Stop Test')`);
                }
                
                // 成功和失败消息
                newContent = newContent.replace(/['"]🎉 恭喜！你已成功绕过 debugger 断点！['"]/, 
                    `(window.currentLang === 'zh-CN' ? '🎉 恭喜！你已成功绕过 debugger 断点！' : '🎉 Congratulations! You have successfully bypassed the debugger breakpoint!')`);
                    
                newContent = newContent.replace(/['"]❌ 未能完全绕过 debugger 断点['"]/, 
                    `(window.currentLang === 'zh-CN' ? '❌ 未能完全绕过 debugger 断点' : '❌ Failed to completely bypass the debugger breakpoint')`);
                
                // 完全移除变量重复声明的问题 - 不尝试替换变量声明
                // 而是在脚本开头预先定义所有可能的变量，避免重复声明
                let scriptPreamble = `
// 预先定义国际化和测试所需变量，避免重复声明
if (typeof window.currentLang === 'undefined') { 
    window.currentLang = "${currentLang}"; 
}
if (typeof window.isTestRunning === 'undefined') {
    window.isTestRunning = false;
}
`;
                
                // 将前导代码添加到脚本开头
                newContent = scriptPreamble + newContent;
                
                newScript.textContent = newContent;
                script.parentNode.replaceChild(newScript, script);
            }
        });
    }
    
    // 更新测试用例标题
    updateCaseTitle(titleElement) {
        const titleText = titleElement.textContent.trim();
        
        if (titleText.includes('eval')) {
            titleElement.textContent = this.i18n.t('testCase.eval.title');
        } 
        else if (titleText.includes('Function')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? 'Function 构造函数测试' : 'Function Constructor Test';
        }
        else if (titleText.includes('setInterval') && titleText.includes('基础')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 基础测试' : 'Basic setInterval Test';
        }
        else if (titleText.includes('setInterval') && titleText.includes('高级')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? 'setInterval 高级测试' : 'Advanced setInterval Test';
        }
        else if (titleText.includes('数组')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? '数组构造函数测试' : 'Array Constructor Test';
        }
        else if (titleText.includes('对象')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? '对象构造函数测试' : 'Object Constructor Test';
        }
        else if (titleText.includes('其他')) {
            titleElement.textContent = this.i18n.currentLang === 'zh-CN' ? '其他测试用例' : 'Other Test Cases';
        }
    }
    
    // 更新测试用例描述
    updateCaseDescription() {
        const description = document.querySelector('.test-container > p');
        if (!description) return;
        
        const titleText = document.querySelector('.test-container h2').textContent.trim();
        
        if (titleText.includes('eval')) {
            description.textContent = this.i18n.t('testCase.eval.description');
        } 
        else if (titleText.includes('Function')) {
            description.textContent = this.i18n.currentLang === 'zh-CN' 
                ? '这是一个使用 Function 构造函数执行 debugger 语句的测试用例。' 
                : 'This is a test case that uses the Function constructor to execute the debugger statement.';
        }
        else if (titleText.includes('setInterval') && (titleText.includes('基础') || titleText.includes('Basic'))) {
            description.innerHTML = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用 <code>setInterval</code> 循环执行 debugger 语句的测试用例。'
                : 'This is a test case that uses <code>setInterval</code> to execute the debugger statement in a loop.';
        }
        else if (titleText.includes('setInterval') && (titleText.includes('高级') || titleText.includes('Advanced'))) {
            description.innerHTML = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用 <code>setInterval</code> 的高级变体执行 debugger 语句的测试用例。此测试使用了字符串拼接和立即执行函数表达式来构造并执行 debugger 语句。'
                : 'This is a test case that uses an advanced variant of <code>setInterval</code> to execute the debugger statement. This test uses string concatenation and immediately invoked function expressions to construct and execute the debugger statement.';
        }
        else if (titleText.includes('数组') || titleText.includes('Array')) {
            description.textContent = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用数组的构造函数链执行 debugger 语句的测试用例。'
                : 'This is a test case that uses the array constructor chain to execute the debugger statement.';
        }
        else if (titleText.includes('对象') || titleText.includes('Object')) {
            description.textContent = this.i18n.currentLang === 'zh-CN'
                ? '这是一个使用对象的构造函数执行 debugger 语句的测试用例。'
                : 'This is a test case that uses the object constructor to execute the debugger statement.';
        }
        else if (titleText.includes('其他') || titleText.includes('Other')) {
            description.textContent = this.i18n.currentLang === 'zh-CN'
                ? '这是一个包含各种其他方式执行 debugger 语句的测试用例。'
                : 'This is a test case containing various other ways to execute the debugger statement.';
        }
    }
    
    // 更新测试指南标题
    updateGuideTitle() {
        const guideTitle = document.querySelector('.guide-steps h3');
        if (!guideTitle) return;
        
        const icon = guideTitle.querySelector('i');
        guideTitle.innerHTML = '';
        if (icon) guideTitle.appendChild(icon);
        guideTitle.appendChild(document.createTextNode(' ' + this.i18n.t('testCase.guide.title')));
    }
    
    // 更新测试指南步骤
    updateGuideSteps() {
        const guideSteps = document.querySelectorAll('.steps-list li');
        if (!guideSteps || guideSteps.length === 0) return;
        
        // 根据页面内容判断是普通测试还是setInterval测试
        const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
        
        // 使用适当的步骤文本
        const steps = isIntervalTest 
            ? [
                this.i18n.currentLang === 'zh-CN' 
                    ? '打开浏览器开发者工具（Windows/Linux 按 F12，macOS 按 Command+Option+I，或右键选择"检查"）'
                    : 'Open browser developer tools (F12 on Windows/Linux, Command+Option+I on macOS, or right-click and select "Inspect")',
                this.i18n.currentLang === 'zh-CN' 
                    ? '点击"开始测试"按钮，页面会自动触发循环的 debugger 断点'
                    : 'Click the "Start Test" button, the page will automatically trigger a looping debugger breakpoint',
                this.i18n.currentLang === 'zh-CN' 
                    ? '你的目标是：完全绕过这个 debugger 断点，使程序能够立即继续执行'
                    : 'Your goal is to: completely bypass this debugger breakpoint, allowing the program to continue executing immediately',
                this.i18n.currentLang === 'zh-CN' 
                    ? '由于 setInterval 会周期性执行，这个测试会从执行开始监测 3 秒内是否触发了断点'
                    : 'Since setInterval executes periodically, this test will monitor for 3 seconds from execution whether a breakpoint has been triggered',
                this.i18n.currentLang === 'zh-CN' 
                    ? '只有当代码能够持续执行（不被任何断点打断）时，才算真正绕过了 debugger'
                    : 'Only when the code can execute continuously (without being interrupted by any breakpoint) is the debugger truly bypassed'
            ]
            : this.i18n.t('testCase.guide.steps');
        
        for (let i = 0; i < Math.min(steps.length, guideSteps.length); i++) {
            // 保持原有的格式（比如粗体标签等）
            const step = steps[i];
            if (step.includes('完全绕过') || step.includes('completely bypass')) {
                guideSteps[i].innerHTML = step.replace(/(完全绕过.*执行|completely bypass.*immediately)/g, '<strong>$1</strong>');
            } else {
                guideSteps[i].textContent = step;
            }
        }
    }
    
    // 更新代码区标签
    updateCodeLabel() {
        const codeBlock = document.querySelector('.code-block');
        if (!codeBlock) return;
        
        // 创建完整的样式覆盖，强制覆盖原有的content属性值
        const style = document.createElement('style');
        style.textContent = `
            .code-block::before { 
                content: "${this.i18n.t('testCase.codeLabel')}" !important; 
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
        
        // 检查是否已经添加过样式
        const existingStyle = document.querySelector('style[data-i18n-code-label]');
        if (existingStyle) {
            existingStyle.textContent = style.textContent;
        } else {
            style.setAttribute('data-i18n-code-label', 'true');
            document.head.appendChild(style);
        }
    }
    
    // 更新按钮和状态文本
    updateButtons() {
        const testButton = document.getElementById('testButton');
        if (testButton) testButton.textContent = this.i18n.t('testCase.startTest');
        
        const stopButton = document.getElementById('stopButton');
        if (stopButton) {
            stopButton.textContent = this.i18n.currentLang === 'zh-CN' ? '停止测试' : 'Stop Test';
        }
        
        // 更新"测试运行中..."和"测试完成"文本
        const testStatus = document.getElementById('testStatus');
        if (testStatus && testStatus.textContent.includes('测试运行中')) {
            testStatus.textContent = this.i18n.t('testCase.testRunning');
        } else if (testStatus && testStatus.textContent.includes('测试完成')) {
            testStatus.textContent = this.i18n.t('testCase.testComplete');
        }
    }
    
    // 更新成功和失败消息
    updateResultMessages() {
        // 判断测试类型
        const isIntervalTest = document.querySelector('.test-container h2').textContent.includes('setInterval');
        
        // 更新成功消息
        const successMsg = document.querySelector('#success');
        if (successMsg) {
            const successTitle = this.i18n.t('testCase.success.title');
            const successDetail = isIntervalTest
                ? (this.i18n.currentLang === 'zh-CN' ? '测试期间未检测到任何断点暂停。' : 'No breakpoint pauses detected during the test.')
                : this.i18n.t('testCase.success.detail').replace('{time}', '<span id="execTime">0</span>');
            
            // 检查是否已经更新过
            if (!successMsg.getAttribute('data-i18n-updated') || successMsg.getAttribute('data-i18n-updated') !== this.i18n.currentLang) {
                successMsg.innerHTML = '';
                successMsg.appendChild(document.createTextNode(successTitle));
                
                const newDetails = document.createElement('div');
                newDetails.className = 'details';
                
                if (isIntervalTest) {
                    newDetails.textContent = successDetail;
                } else {
                    newDetails.id = 'execTimeContainer';
                    newDetails.innerHTML = successDetail;
                }
                
                successMsg.appendChild(newDetails);
                successMsg.setAttribute('data-i18n-updated', this.i18n.currentLang);
            }
        }
        
        // 更新失败消息
        const failureMsg = document.querySelector('#failure');
        if (failureMsg) {
            const failureTitle = this.i18n.t('testCase.failure.title');
            const failureDetail = isIntervalTest
                ? (this.i18n.currentLang === 'zh-CN' ? '测试期间检测到执行被断点中断。' : 'Execution was interrupted by a breakpoint during the test.')
                : this.i18n.t('testCase.failure.detail').replace('{time}', '<span id="execTimeFailure">0</span>');
            
            // 检查是否已经更新过
            if (!failureMsg.getAttribute('data-i18n-updated') || failureMsg.getAttribute('data-i18n-updated') !== this.i18n.currentLang) {
                failureMsg.innerHTML = '';
                failureMsg.appendChild(document.createTextNode(failureTitle));
                
                const newDetails = document.createElement('div');
                newDetails.className = 'details';
                
                if (isIntervalTest) {
                    newDetails.textContent = failureDetail;
                } else {
                    newDetails.id = 'execTimeFailureContainer';
                    newDetails.innerHTML = failureDetail;
                }
                
                failureMsg.appendChild(newDetails);
                failureMsg.setAttribute('data-i18n-updated', this.i18n.currentLang);
            }
        }
    }
    
    // 更新测试页面上的按钮标签
    updateTestCaseButtons() {
        // 查找所有测试按钮
        const testButtons = document.querySelectorAll('.case-badge');
        if (!testButtons || testButtons.length === 0) return;
        
        testButtons.forEach(button => {
            const buttonText = button.textContent.trim();
            const iconElement = button.querySelector('i');
            
            if (buttonText.includes('基础测试') || buttonText.includes('Basic Test')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '基础测试' : 'Basic Test'));
            }
            else if (buttonText.includes('定时器') || buttonText.includes('Timer')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '定时器' : 'Timer'));
            }
            else if (buttonText.includes('构造函数') || buttonText.includes('Constructor')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '构造函数' : 'Constructor'));
            }
            else if (buttonText.includes('在线网站') || buttonText.includes('Online Site')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '在线网站' : 'Online Site'));
            }
            else if (buttonText.includes('工具网站') || buttonText.includes('Tool Site')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '工具网站' : 'Tool Site'));
            }
            else if (buttonText.includes('其他') || buttonText.includes('Other')) {
                button.innerHTML = '';
                if (iconElement) button.appendChild(iconElement);
                button.appendChild(document.createTextNode(this.i18n.currentLang === 'zh-CN' ? '其他' : 'Other'));
            }
        });
    }
} 
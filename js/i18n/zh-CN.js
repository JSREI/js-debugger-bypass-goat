const zhCN = {
    title: 'JavaScript debugger bypass绕过靶场测试平台',
    nav: {
        home: '首页',
        testCases: '测试用例'
    },
    hero: {
        badge: '开源项目',
        title: 'JavaScript debugger bypass绕过靶场测试平台',
        description: '一个用于测试和验证 JavaScript 调试绕过技术的在线靶场平台',
        startTest: '开始测试',
        viewSource: '查看源码'
    },
    workflow: {
        title: '工作流程',
        subtitle: '如何使用',
        description: '通过简单的步骤，快速开始你的测试',
        steps: {
            step1: {
                title: '选择测试用例',
                description: '从多个测试用例中选择需要验证的场景'
            },
            step2: {
                title: '准备测试工具',
                description: '选择合适的调试工具和测试环境'
            },
            step3: {
                title: '执行测试',
                description: '运行测试并观察结果'
            }
        }
    },
    cta: {
        badge: '开始使用',
        title: '准备好开始测试了吗？',
        description: '立即开始测试各种 JavaScript 调试绕过技术',
        startTest: '开始测试'
    },
    button: {
        startUsing: '开始使用'
    },
    joinGroup: {
        title: '加入我们的交流群',
        reverseGroup: '微信技术交流群',
        wechat: '微信个人号（发送【逆向群】拉你进群）',
        qq: 'QQ群',
        telegram: 'Telegram 电报群',
        click_to_join: '点此加入'
    },
    footer: {
        feedback: '问题反馈',
        rights: '© 2024 JSREI (JavaScript Reverse Engineering Infrastructure). All rights reserved.'
    },
    // 测试用例页面
    casesPage: {
        title: '测试用例列表 - JavaScript 调试绕过靶场测试平台',
        badge: '测试用例',
        heading: '调试器绕过靶场测试用例',
        description: '以下是所有可用的测试用例，点击即可开始测试',
        categories: {
            basic: '基础执行模式',
            timer: '定时器模式',
            constructor: '构造函数模式',
            online: '在线网站测试',
            tools: '工具网站测试',
            other: '其他模式'
        },
        contribute: {
            title: '发现更多有趣的测试用例？',
            description: '如果你发现了其他有趣的调试检测场景，欢迎分享给我们！提交新的测试用例非常简单，我们会第一时间处理你的贡献',
            newCase: '提交新用例',
            submitPR: '提交 PR'
        }
    },
    // 测试用例详情页
    testCase: {
        eval: {
            title: 'eval 执行测试',
            description: '这是一个使用 eval() 函数执行 debugger 语句的测试用例。'
        },
        guide: {
            title: '测试指南',
            steps: [
                '打开浏览器开发者工具（Windows/Linux 按 F12，macOS 按 Command+Option+I，或右键选择"检查"）',
                '点击"开始测试"按钮，页面会自动触发 debugger 断点',
                '你的目标是：完全绕过这个 debugger 断点，使程序能够立即继续执行',
                '如果代码执行时间超过 100ms，说明断点生效了，需要继续优化你的绕过方案',
                '只有当代码能够立即执行（不被断点打断）时，才算真正绕过了 debugger'
            ]
        },
        codeLabel: '测试代码',
        startTest: '开始测试',
        testRunning: '测试运行中...',
        testComplete: '测试完成',
        success: {
            title: '🎉 恭喜！你已成功绕过 debugger 断点！',
            detail: '执行时间: {time}ms'
        },
        failure: {
            title: '❌ 未能完全绕过 debugger 断点',
            detail: '执行时间: {time}ms，超过了 100ms 的限制，说明断点仍然生效。'
        }
    }
}; 
/**
 * 简体中文语言资源
 * 以嵌套对象形式组织所有翻译项
 */
export default {
    title: 'JavaScript Debugger Bypass Goat',
    nav: {
        home: '首页',
        testCases: '测试用例'
    },
    footer: {
        feedback: '问题反馈'
    },
    testCase: {
        codeLabel: '测试代码',
        startTest: '开始测试',
        stopTest: '停止测试',
        testRunning: '测试运行中...',
        testComplete: '测试完成',
        guide: {
            title: '测试指南'
        },
        success: {
            title: '🎉 恭喜！你已成功绕过 debugger 断点！',
            detail: '执行时间: {time}ms'
        },
        failure: {
            title: '❌ 未能完全绕过 debugger 断点',
            detail: '执行时间: {time}ms，超过了 100ms 的限制，说明断点仍然生效。'
        },
        testTypes: {
            eval: 'eval 执行测试',
            function: 'Function 构造函数测试',
            array: '数组方法测试',
            object: '对象方法测试', 
            interval: '定时器测试',
            other: '其他测试'
        },
        instructions: {
            openDevTools: '打开浏览器开发者工具（Windows/Linux 按 F12，macOS 按 Command+Option+I，或右键选择"检查"）',
            clickStart: '点击"开始测试"按钮，页面会自动触发 debugger 断点',
            goal: '你的目标是：<strong>完全绕过这个 debugger 断点，使程序能够立即继续执行</strong>',
            timeLimit: '如果代码执行时间超过 100ms，说明断点生效了，需要继续优化你的绕过方案',
            success: '只有当代码能够立即执行（不被断点打断）时，才算真正绕过了 debugger'
        }
    },
    common: {
        loading: '加载中...',
        error: '发生错误',
        retry: '重试',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        edit: '编辑',
        delete: '删除',
        copyCode: '复制代码',
        copied: '已复制！',
        share: '分享',
        fullScreen: '全屏',
        exitFullScreen: '退出全屏',
        settings: '设置',
        language: '语言',
        theme: '主题',
        light: '浅色',
        dark: '深色',
        auto: '自动',
        version: '版本',
        about: '关于',
        noData: '暂无数据'
    }
}; 
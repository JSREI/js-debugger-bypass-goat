/**
 * 英语(美国)语言资源
 * 以嵌套对象形式组织所有翻译项，保持与中文相同的结构
 */
export default {
    title: 'JavaScript Debugger Bypass Goat',
    nav: {
        home: 'Home',
        testCases: 'Test Cases'
    },
    footer: {
        feedback: 'Feedback'
    },
    testCase: {
        codeLabel: 'Test Code',
        startTest: 'Start Test',
        stopTest: 'Stop Test',
        testRunning: 'Test Running...',
        testComplete: 'Test Complete',
        guide: {
            title: 'Test Guide'
        },
        success: {
            title: '🎉 Congratulations! You have successfully bypassed the debugger breakpoint!',
            detail: 'Execution time: {time}ms'
        },
        failure: {
            title: '❌ Failed to completely bypass the debugger breakpoint',
            detail: 'Execution time: {time}ms, exceeding the 100ms limit, indicating the breakpoint is still effective.'
        },
        testTypes: {
            eval: 'eval Execution Test',
            function: 'Function Constructor Test',
            array: 'Array Methods Test',
            object: 'Object Methods Test',
            interval: 'Timer Test',
            other: 'Other Tests'
        },
        instructions: {
            openDevTools: 'Open browser developer tools (F12 on Windows/Linux, Command+Option+I on macOS, or right-click and select "Inspect")',
            clickStart: 'Click the "Start Test" button, the page will automatically trigger a debugger breakpoint',
            goal: 'Your goal is to <strong>completely bypass this debugger breakpoint, allowing the program to continue executing immediately</strong>',
            timeLimit: 'If the code execution time exceeds 100ms, it means the breakpoint is still effective and you need to optimize your bypass solution',
            success: 'Only when the code can execute immediately (without being interrupted by the breakpoint) will you have truly bypassed the debugger'
        }
    },
    common: {
        loading: 'Loading...',
        error: 'Error occurred',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        copyCode: 'Copy Code',
        copied: 'Copied!',
        share: 'Share',
        fullScreen: 'Full Screen',
        exitFullScreen: 'Exit Full Screen',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        version: 'Version',
        about: 'About',
        noData: 'No Data'
    }
}; 
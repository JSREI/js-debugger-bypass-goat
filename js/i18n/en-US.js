const enUS = {
    title: 'JavaScript Debugger Bypass Goat Testing Platform',
    nav: {
        home: 'Home',
        testCases: 'Test Cases'
    },
    hero: {
        badge: 'Open Source',
        title: 'JavaScript Debugger Bypass Goat Testing Platform',
        description: 'An online platform for testing and validating JavaScript debugger bypass techniques',
        startTest: 'Start Testing',
        viewSource: 'View Source'
    },
    workflow: {
        title: 'Workflow',
        subtitle: 'How to Use',
        description: 'Start your testing quickly with simple steps',
        steps: {
            step1: {
                title: 'Choose Test Case',
                description: 'Select a scenario from multiple test cases'
            },
            step2: {
                title: 'Prepare Tools',
                description: 'Choose suitable debugging tools and test environment'
            },
            step3: {
                title: 'Execute Test',
                description: 'Run the test and observe results'
            }
        }
    },
    cta: {
        badge: 'Get Started',
        title: 'Ready to Start Testing?',
        description: 'Start testing various JavaScript debugger bypass techniques now',
        startTest: 'Start Testing'
    },
    button: {
        startUsing: 'Get Started'
    },
    joinGroup: {
        title: 'Join Our Community',
        reverseGroup: 'WeChat Group (Chinese Tech Community)',
        wechat: 'WeChat (Send "Reverse Group" to join)',
        telegram: 'Telegram Group',
        click_to_join: 'Click to join'
    },
    footer: {
        feedback: 'Feedback',
        rights: '© 2024 JSREI (JavaScript Reverse Engineering Infrastructure). All rights reserved.'
    },
    // Test cases page
    casesPage: {
        title: 'Test Cases - JavaScript Debugger Bypass Goat Testing Platform',
        badge: 'Test Cases',
        heading: 'Debugger Bypass Goat Test Cases',
        description: 'Here are all available test cases, click to start testing',
        categories: {
            basic: 'Basic Execution Patterns',
            timer: 'Timer Patterns',
            constructor: 'Constructor Patterns',
            online: 'Online Site Tests',
            tools: 'Tool Sites Tests',
            other: 'Other Patterns'
        },
        contribute: {
            title: 'Found More Interesting Test Cases?',
            description: 'If you find other interesting debugging detection scenarios, feel free to share with us! Submitting new test cases is very simple, and we will process your contribution as soon as possible.',
            newCase: 'Submit New Case',
            submitPR: 'Submit PR'
        }
    },
    // Test case detail page
    testCase: {
        eval: {
            title: 'eval Execution Test',
            description: 'This is a test case that uses the eval() function to execute the debugger statement.'
        },
        guide: {
            title: 'Test Guide',
            steps: [
                'Open browser developer tools (F12 on Windows/Linux, Command+Option+I on macOS, or right-click and select "Inspect")',
                'Click the "Start Test" button, the page will automatically trigger a debugger breakpoint',
                'Your goal is to: completely bypass this debugger breakpoint, allowing the program to continue executing immediately',
                'If the code execution time exceeds 100ms, the breakpoint is still effective, and you need to continue optimizing your bypass solution',
                'Only when the code can execute immediately (without being interrupted by the breakpoint) is the debugger truly bypassed'
            ]
        },
        codeLabel: 'Test Code',
        startTest: 'Start Test',
        testRunning: 'Test Running...',
        testComplete: 'Test Complete',
        success: {
            title: '🎉 Congratulations! You have successfully bypassed the debugger breakpoint!',
            detail: 'Execution time: {time}ms'
        },
        failure: {
            title: '❌ Failed to completely bypass the debugger breakpoint',
            detail: 'Execution time: {time}ms, exceeding the 100ms limit, indicating the breakpoint is still effective.'
        }
    }
}; 
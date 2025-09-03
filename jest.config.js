// jest.config.js
module.exports = {
    testEnvironment: "node",
    globalSetup: "./global-setup.js",
    reporters: [
        "default",
        [
            "jest-html-reporter",
            {
                pageTitle: "Test Report",
                outputPath: "./test_results/test-report.html",
                includeFailureMsg: true,
                includeSuiteFailure: true,
                theme: "defaultTheme",
            },
        ],
    ],
};

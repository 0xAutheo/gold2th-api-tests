// jest.config.mjs
export default {
    testEnvironment: "node",
    transform: {},
    reporters: [
        "default",
        [
            "jest-html-reporter",
            {
                pageTitle: "Test Report",
                outputPath: "./reports/test-report.html",
                includeFailureMsg: true,
                includeSuiteFailure: true
            }
        ]
    ]
};

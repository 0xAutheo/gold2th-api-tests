module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "node",
    reporters: [
        "default",
        ["jest-html-reporter", {
            pageTitle: "Test Report",
            outputPath: "reports/test-report.html"
        }]
    ]
};

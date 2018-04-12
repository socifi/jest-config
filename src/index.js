const path = require('path');

/**
 * Get Jest configuration file.
 *
 * @param {string} testing - Testing source code or bundle?
 * @param {Object} settings - Extendable settings
 * @returns {Object} Jest settings
 */
module.exports = (testing = 'source', settings) => {
    const isTestingBundle = testing === 'bundle';

    process.env.JEST_JUNIT_OUTPUT = `./tests_results/unit/junit${isTestingBundle ? '-bundle' : ''}.xml`;

    return {
        transform: { '.*': path.resolve(__dirname, 'babel.processor.js') },
        collectCoverage: !isTestingBundle,
        coverageDirectory: 'tests_results/coverage',
        testResultsProcessor: 'jest-junit',
        collectCoverageFrom: ['src/**/*.{js,jsx}'],
        coverageReporters: ['text', 'cobertura', 'lcov'],
        projects: [
            'tests',
        ],
        transformIgnorePatterns: [
            '<rootDir>/node_modules/(?!(ui-constants/src|ui-models/src|ui-admin-api-service/src|ui-storages/src|' +
            'ui-auths/src|ui-forms/src)/)',
            '<rootDir>/dist',
        ],
        moduleNameMapper: {
            '\\.(css|less)$': 'identity-obj-proxy',
            ...(isTestingBundle ? {
                '(.*)src(.*)': '$1dist$2',
            } : {}),
        },
        ...settings,
    };
};
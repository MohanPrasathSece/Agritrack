const path = require('path');
const fs = require('fs');

const out = [];
out.push('Current directory: ' + process.cwd());
out.push('Node version: ' + process.version);

const modulesToTest = [
    'react-scripts',
    'react-dev-utils/crossSpawn',
    'cross-spawn',
    'which'
];

modulesToTest.forEach(m => {
    try {
        const resolvedPath = require.resolve(m);
        out.push(`✅ ${m} resolved to: ${resolvedPath}`);
    } catch (e) {
        out.push(`❌ ${m} failed to resolve: ${e.message}`);
    }
});

const reactScriptsPath = path.resolve('..', 'node_modules', 'react-scripts', 'package.json');
if (fs.existsSync(reactScriptsPath)) {
    out.push(`Found react-scripts at: ${reactScriptsPath}`);
} else {
    out.push(`Did NOT find react-scripts at: ${reactScriptsPath}`);
}

fs.writeFileSync('debug-out.log', out.join('\n'));
console.log('Results written to debug-out.log');

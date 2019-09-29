const os = require('os');
const env = require('dotenv').config();

const cores = os.cpus().length;

module.exports = {
    apps: [
        {
            name: 'heritage-api',
            script: './index.ts',
            env: env.parsed,
            watch: ['src'],
            ignore_watch: ['node_modules'],
            watch_options: {
                followSymlinks: false
            },
            instances: cores,
            exec_mode: 'cluster'
        }
    ]
};

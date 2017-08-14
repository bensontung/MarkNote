const fs = require('fs');
const path = require('path');

let env = fs.readFileSync(path.join(__dirname, 'env_conf.json'));
    env = JSON.parse(env.toString());

if (env.dev === true) {
    require('./env/dev/main');
} else {
    require('./main');
}

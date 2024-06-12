// @ts-check

import config, { disableJSTypeChecked } from './packages/eslint-config/index.js';

export default [...config, ...disableJSTypeChecked];

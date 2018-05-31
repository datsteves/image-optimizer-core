require("babel-polyfill") // eslint-disable-line 

import optimizer from './optimizer'  // eslint-disable-line 

export default optimizer
module.exports = optimizer // to be sure that require('...') is still working

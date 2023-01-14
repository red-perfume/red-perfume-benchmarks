'use strict';

const fs = require('fs');
const path = require('path');

const helpers = require('./helpers.js');
const runBenchmark = require('./tool.js');

function runBenchmarks (atomizer) {
  function read (file) {
    const filePath = path.resolve(__dirname, 'libraries', file + '.css');
    let data = '';

    try {
      data = String(fs.readFileSync(filePath));
    } catch (error1) {
      helpers.throwError('Error reading file', error1);
    }

    return data;
  }

  // Inputs
  const inputs = [
    { library: 'Bootstrap',  version: 'v1.1.1',  file: 'bootstrap-1.1.1'  },
    { library: 'Bootstrap',  version: 'v2.3.2',  file: 'bootstrap-2.3.2'  },
    { library: 'Bootstrap',  version: 'v3.4.1',  file: 'bootstrap-3.4.1'  },
    { library: 'Bootstrap',  version: 'v4.6.2',  file: 'bootstrap-4.6.2'  },
    { library: 'Bootstrap',  version: 'v5.2.3',  file: 'bootstrap-5.2.3'  },
    { library: 'Blue Steel', version: 'v0.3.0',  file: 'bsds-0.3.0'       },
    { library: 'Bulma',      version: 'v0.9.4',  file: 'bulma-0.9.4'      },
    { library: 'Foundation', version: 'v5.5.3',  file: 'foundation-5.5.3' },
    { library: 'Foundation', version: 'v6.7.5',  file: 'foundation-6.7.5' },
    { library: 'Milligram',  version: 'v1.4.1',  file: 'milligram-1.4.1'  },
    { library: 'Normalize',  version: 'v8.0.1',  file: 'normalize-8.0.1'  },
    { library: 'Skeleton',   version: 'v2.0.4',  file: 'skeleton-2.0.4'   },
    { library: 'Tailwind',   version: 'v2.2.19', file: 'tailwind-2.2.19'  },
    { library: 'Water',      version: 'v2.1.1',  file: 'water-2.1.1'      },
    { library: 'WWT.com',    version: '(2023)',  file: 'wwt'              }
  ];

  // Results
  let errors = 0;
  const results = [];
  inputs.forEach(function (input) {
    const data = read(input.file);
    let result = {};
    try {
      result = runBenchmark(data, atomizer);
    } catch (error2) {
      helpers.throwError('Error producing benchmark', error2);
    }
    const output = {
      library: input.library,
      version: input.version,
      ...result
    };
    if (output.atomizedErrors) {
      errors = errors + 1;
    }
    results.push(output);
  });

  return {
    results,
    errors
  };
}

module.exports = runBenchmarks;

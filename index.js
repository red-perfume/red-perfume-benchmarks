'use strict';

const fs = require('fs');

const runBenchmark = require('./tool.js');

function runBenchmarks (atomizer) {
  function read (file) {
    return String(fs.readFileSync(file));
  }

  // Inputs
  const inputs = [
    { library: 'Bootstrap',  version: 'v1.1.1',  file: './libraries/bootstrap-1.1.1.css'                    },
    { library: 'Bootstrap',  version: 'v2.3.2',  file: './libraries/bootstrap-2.3.2.css'                    },
    { library: 'Bootstrap',  version: 'v3.4.1',  file: './node_modules/bootstrap3/dist/css/bootstrap.css'   },
    { library: 'Bootstrap',  version: 'v4.6.2',  file: './node_modules/bootstrap4/dist/css/bootstrap.css'   },
    { library: 'Bootstrap',  version: 'v5.2.3',  file: './node_modules/bootstrap5/dist/css/bootstrap.css'   },
    { library: 'Blue Steel', version: 'v0.3.0',  file: './libraries/bsds-0.3.0.css'                         },
    { library: 'Bulma',      version: 'v0.9.4',  file: './libraries/bulma-0.9.4.css'                        },
    { library: 'Foundation', version: 'v5.5.3',  file: './libraries/foundation-5.5.3.css'                   },
    { library: 'Foundation', version: 'v6.7.5',  file: './node_modules/foundation6/dist/css/foundation.css' },
    { library: 'Milligram',  version: 'v1.4.1',  file: './libraries/milligram-1.4.1.css'                    },
    { library: 'Normalize',  version: 'v8.0.1',  file: './libraries/normalize-8.0.1.css'                    },
    { library: 'Skeleton',   version: 'v2.0.4',  file: './libraries/skeleton-2.0.4.css'                     },
    { library: 'Tailwind',   version: 'v2.2.19', file: './libraries/tailwind-2.2.19.css'                    },
    { library: 'Water',      version: 'v2.1.1',  file: './libraries/water-2.1.1.css'                        },
    { library: 'WWT.com',    version: '(2023)',  file: './libraries/wwt.css'                                }
  ];

  // Results
  let errors = 0;
  const results = [];
  inputs.forEach(function (input) {
    const data = read(input.file);
    const output = {
      library: input.library,
      version: input.version,
      ...runBenchmark(data, atomizer)
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

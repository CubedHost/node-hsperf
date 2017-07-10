# node-hsperf
Parse HotSpot JVM perf data files in Node.js

## Installation
`npm install hsperf`

## Usage
```Javascript
const fs = require('fs');
const hsperf = require('hsperf');

// Replace with path to a real hsperfdata file
const path = '/tmp/hsperfdata_root/1234';
let data = fs.readFileSync(path);

// Read and parse hsperfdata
data = hsperf.parse(data)
console.log(data);
```

#### Example output
```
{
  prologue: {
    numEntries: 215,
    ...
  },
  entries: [
    {
      name: 'sun.gc.generation.0.space.1.used',
      value: 123456789
    },
    ...
  ]
}

```

## Acknowledgements
Thanks to @YaSuenag for [hsbeat](https://github.com/YaSuenag/hsbeat), which helped provide a guide for parsing the hsperfdata format.

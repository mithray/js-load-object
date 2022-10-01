# load-object

[![npm package][npm-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![GitHub last commit](https://img.shields.io/github/last-commit/mithrayls/js-load-object)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/load-object)
![NPM](https://img.shields.io/npm/l/load-object)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/mithrayls/js-load-object)

<!--
Hasn't been picked up yet:
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/load-object)
-->

`load-object` is a useful `node.js` utility package for loading data. `load-object` loads data into a Javascript object from JSON, YAML, TOML, CBOR, Dhall, XML, HTML and Markdown both locally and remotely, thereby removing the need to manually pass the files to different parsers.

## Issues:
- CBOR not working remotely due to `undici`.
- Dhall will probably only work on Linux and if you have dhall-to-json installed as it depends on native bindings.

## Installation

```bash
npm install load-object
```

## Usage

Include with either module type:

### MJS
``` node
import load from "load-object"
```
### CJS
``` node
const load = require("load-object")
```

### Use Locally
```node
// Should have one of these extensions: .json, .yaml, .yml, .dhall, .toml, .md, .cbor
const filePath = "./openapi.json"
const object  = load(filePath)
```

### Use Remotely
```node
// Should have one of these extensions: .json, .yaml, .yml, .dhall, .toml, .md
const url = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json"
const object = load(url)
```

[npm-image]: https://img.shields.io/npm/v/load-object.svg
[npm-url]: http://npmjs.org/package/load-object
[coveralls-image]: https://coveralls.io/repos/github/mithrayls/js-load-object/badge.svg?branch=main
[coveralls-url]: https://coveralls.io/github/mithrayls/js-load-object?branch=main

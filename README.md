# load-object

[![npm package][npm-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![GitHub last commit](https://img.shields.io/github/last-commit/mithrayls/js-load-object)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/load-object)
![NPM](https://img.shields.io/npm/l/load-object)
<!-- Some how there is still an out of date dependency here, I can't work out where it is-->
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/mithrayls/js-load-object)

<!--
npms.io hasn't picked up this package yet!:
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/load-object)

Will Include this badge probably if I use clojurescript. Otherwise, there's nothing special about Javascript!
![GitHub top language](https://img.shields.io/github/languages/top/mithrayls/js-load-object)

Package Health, just monitor this until it gets a bit higher ;-)
[![load-object](https://snyk.io/advisor/npm-package/load-object/badge.svg)](https://snyk.io/advisor/npm-package/load-object)

Might include later
[![built with nix](https://builtwithnix.org/badge.svg)](https://builtwithnix.org)
-->

`load-object` is a useful `node.js` utility package for loading data. `load-object` loads data into a Javascript object from JSON, YAML, TOML, CBOR, Dhall, XML, HTML and Markdown both locally and remotely, thereby removing the need to manually pass the files to different parsers.

## Issues:
- Dhall will probably only work on Linux and if you have dhall-to-json installed as it depends on native bindings. A resolution is planned for this by rewriting in `Purescript`.

## Installation

```bash
npm install load-object
```

## Usage

### ES Modules

``` node
import { load } from "load-object"
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

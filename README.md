# load-object

[![npm package][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

## Summary

`load-object` is an *immensely* useful utility package for loading data which I don't know why has not been built by others yet. It is already working very well and saving me tons of time. `load-object` loads data into a Javascript object from YAML, JSON, CBOR, or Dhall both locally and remotely without bothering with manually handling the implementation of these things each time. Thus, currently, this package does the work of 8 separate boilerplate functions. 

## Issues:
- CBOR not working remotely due to `undici`.
- Dhall will probably only work on Linux and if you have dhall-to-json installed as it depends on native bindings.

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

#### Use Locally
```node
// File name should have one of these extensions .json, .yaml, .yml, .cbor, .dhall
const filePath    = "./openapi.json"
const object      =  load(filePath)
```

### Use Remotely
```node
// File name should have one of these extensions .json, .yaml, .yml, .cbor, .dhall
const url         = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json"
const object      = load(url)
```

[npm-image]:https://img.shields.io/npm/v/load-object.svg
[npm-url]:http://npmjs.org/package/load-object
[travis-image]:https://travis-ci.com/glicht/load-object.svg?branch=master
[travis-url]:https://travis-ci.com/glicht/load-object
[coveralls-image]:https://coveralls.io/repos/github/glicht/load-object/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/glicht/load-object?branch=master

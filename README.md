# load-object

## Summary

`load-object` is an *immensely* useful utility package for loading data which I don't know why has not been built by others yet. It is already working very well and saving me tons of time. `load-object` loads data into a Javascript object from YAML, JSON, CBOR, or Dhall both locally and remotely without bothering with manually handling the implementation of these things each time. Thus, currently, this package does the work of 8 separate boilerplate functions. 

## Issues:
- CBOR may have issues remotely due to mime type.
- Dhall will probably only work on Linux and if you have dhall-to-json installed as it depends on native bindings.

## Planned support for:
- XML and maybe HTML
- Adding directories recursively

## Usage

Include with either module type:

1. MJS
``` node
import load from "load-object"
```
2. CJS
``` node
const load = require("load-object")
```

### Loading Local

To use:

#### JSON
```node
const filePath    = "./openapi.json"
const object      =  load(filePath)
```

#### YAML
```node
const filePath    = "./openapi.yaml"
const object      =  load(filePath)
```

#### CBOR
```node
const filePath    = "./openapi.cbor"
const object      =  load(filePath)
```

#### Dhall
```node
const filePath    = "./openapi.dhall"
const object      = load(url)
```

### Loading Remote

#### JSON
```node
const url         = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json"
const object      = load(url)
```

#### YAML
```node
const url         = "https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml"
const object      = load(url)
```

#### CBOR
```node
const url         = "https://github.com/ipld/js-dag-cbor/blob/master/test/fixtures/array-link.cbor?raw=true"
const object      = load(url)
```

#### Dhall
```node
const url         = "https://raw.githubusercontent.com/dhall-lang/dhall-haskell/master/dhall-json/examples/travis.dhall"
const object      = load(url)
```

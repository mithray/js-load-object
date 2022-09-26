# load-object

## Summary

`load-object` is a utility package for loading data into Javascript object from YAML, JSON, CBOR, or Dhall both locally and remotely without bothering with manually handling the implementation of these things each time. Thus, currently, this package does the work of 8 separate boilerplate functions. Currently it's only available for `require` (CJS), but support for EJS is planned.

## Issues:
- CBOR may have issues remotely due to mime type.
- Dhall will probably only work on Linux and if you have dhall-to-json installed as it depends on native bindings.

## Planned support for:
- EJS
- XML and maybe HTML
- Adding directories recursively

## Usage

### Loading Local

#### JSON
```node
const loadObject  = require("load-object")
const filePath    = "./package.json"
const object      =  loadObject(filePath)
```

#### YAML
```node
const loadObject  = require("load-object")
const filePath    = "./openapi.yaml"
const object      =  loadObject(filePath)
```

#### CBOR
```node
const loadObject  = require("load-object")
const filePath    = "./openapi.cbor"
const object      =  loadObject(filePath)
```

#### Dhall
```node
const loadObject  = require("load-object")
const filePath    = "./config.dhall"
const object      = loadObject(url)
```

### Loading Remote

#### JSON
```node
const loadObject  = require("load-object")
const url         = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json"
const object      = loadObject(url)
```

#### YAML
```node
const loadObject  = require("load-object")
const url         = "https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml"
const object      = loadObject(url)
```

#### CBOR
```node
const loadObject  = require("load-object")
const url         = "https://github.com/ipld/js-dag-cbor/blob/master/test/fixtures/array-link.cbor?raw=true"
const object      = loadObject(url)
```

#### Dhall
```node
const loadObject  = require("load-object")
const url         = "https://raw.githubusercontent.com/dhall-lang/dhall-haskell/master/dhall-json/examples/travis.dhall"
const object      = loadObject(url)
```

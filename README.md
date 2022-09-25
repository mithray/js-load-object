# load-object

`load-object` is a utility package for loading a JSON object from YAML, Json, Cbor, either local or remote without bothering with manually handling the implementation of these things each time. Thus, currently, this package does the work of 6 separate boilerplate functions. Currently only available for `require` (CJS).

Notes:
- I'm not sure if the CBOR loading is working as it's meant to, at least, loading from github seems to turn it from binary to string.
- Would love to support [Dhall](https://dhall-lang.org/#) in the future.

## Loading Local

### Loading JSON
```node
const loadObject  = require("load-object")
const filePath    = "./package.json"
const object      =  loadObject(filePath)
```

### Loading YAML
```node
const loadObject  = require("load-object")
const filePath    = "./openapi.yaml"
const object      =  loadObject(filePath)
```

### Loading CBOR
```node
const loadObject  = require("load-object")
const filePath    = "./openapi.cbor"
const object      =  loadObject(filePath)
```

## Loading Remote

### Loading JSON
```node
const loadObject  = require("load-object")
const url         = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json"
const object      = loadObject(url)
```

### Loading YAML
```node
const loadObject  = require("load-object")
const url         = "https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml"
const object      = loadObject(url)
```

### Loading CBOR
```node
const loadObject  = require("load-object")
const url         = "https://github.com/ipld/js-dag-cbor/blob/master/test/fixtures/array-link.cbor?raw=true"
const object      = loadObject(url)
```

const parsePath           = require("parse-path")
const path                = require("path")
const memoizeWith         = require("ramda/src/memoizeWith.js")
const jsYaml              = require("js-yaml")
const dagCbor             = require("@ipld/dag-cbor")
const undici              = require("undici")
const R                   = require("ramda")

const readLocalFile =
  (filePath) => require("fs").readFileSync((filePath))

const readRemoteFile = 
  R.pipe
  ( undici.request
  , R.andThen( (x) => x.body.text() )
  )

const getDocument =
  R.ifElse
    ( x => R.equals(parsePath(x)["protocol"], "file")
    , async x => (
      { content: await readLocalFile(x)
      , extname: path.extname(x)
      })
    , async x => (
      { content: await readRemoteFile(x)
      , extname: path.extname(x)
      })
    )

const parseDocument =
  R.andThen
    ( R.cond(
      [ [ x => [".yaml",".yml"].includes(R.view(R.lensProp("extname"),x))
        , x => jsYaml.load(x.content)
        ]
      , [ x => [".json"].includes(R.view(R.lensProp("extname"),x))
        , x => JSON.parse(x.content)
        ]
      , [ x => [".cbor"].includes(R.view(R.lensProp("extname"),x))
        , x => dagCbor.decode(x.content)
        ]
      ])
    )

const load =
  R.pipe
    ( getDocument
    , parseDocument
//    , R("andThen")( R("tap")(console.log) )
    )

module.exports = load

p="https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml"
load(p).then(console.log)

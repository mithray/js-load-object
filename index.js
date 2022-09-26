const parsePath           = require("parse-path")
const path                = require("path")
const memoizeWith         = require("ramda/src/memoizeWith.js")
const jsYaml              = require("js-yaml")
const dagCbor             = require("@ipld/dag-cbor")
const undici              = require("undici")
const fs                  = require("fs")
const shelljs             = require("shelljs")

const R =
  (f) => memoizeWith(String,require("ramda/src/" + f + ".js"))

const readLocalFile =
  (filePath) => fs.readFileSync(filePath,"utf8")

const readRemoteFile = 
  R("pipe")
  ( undici.request
  , R("andThen")( (x) => x.body.text() )
  )

const getDocument =
  R("ifElse")
    ( x => R("equals")(parsePath(x)["protocol"], "file")
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
  R("andThen")
    ( R("cond")(
      [ [ x => [".yaml",".yml"].includes(x.extname)
        , x => jsYaml.load(x.content)
        ]
      , [ x => [".json"].includes(x.extname)
        , x => JSON.parse(x.content)
        ]
      , [ x => [".cbor"].includes(x.extname)
        , x => dagCbor.decode(x.content)
        ]
      , [ x => [".dhall"].includes(x.extname)
        , x => { 
            const access = fs.createWriteStream('/dev/null')
            const stdwriteOriginal = process.stdout.write
            process.stdout.write = process.stderr.write = access.write.bind(access)
            const { err, stdout, stderr } = shelljs.echo(x.content).exec("dhall-to-json",{silent: true})
            process.stdout.write = process.stderr.write = stdwriteOriginal
            return stdout
          }
        ]
      ])
    )

const load =
  R("pipe")
    ( getDocument
    , parseDocument
    )

module.exports = load

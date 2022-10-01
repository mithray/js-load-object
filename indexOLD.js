const parsePath = require('parse-path')
const path = require('path')
const memoizeWith = require('ramda/src/memoizeWith.js')
const jsYaml = require('js-yaml')
const dagCbor = require('@ipld/dag-cbor')
const undici = require('undici')
const fs = require('fs')
const shelljs = require('shelljs')
const TOML = require('@iarna/toml')
const {XMLParser} = require('fast-xml-parser')
const options = {
    ignoreAttributes : false
};
const marked = require("marked")

const XML = new XMLParser(options)

const R = (f) => memoizeWith(String, require(`ramda/src/${f}.js`))

const readLocalFile = (filePath) => fs.readFileSync(filePath)

const readRemoteFile = R('pipe')(
  undici.request,
  R('andThen')((x) => x.body.text())
)

const getDocument = R('ifElse')(
  (x) => R('equals')(parsePath(x).protocol, 'file'),
  async (x) => (
    {
      content: await readLocalFile(x),
      extname: path.extname(x)
    }),
  async (x) => (
    {
      content: await readRemoteFile(x),
      extname: path.extname(x)
    })
)

const parseDocument = R('andThen')(R('cond')(
  [[(x) => ['.yaml', '.yml'].includes(x.extname),
    (x) => jsYaml.load(x.content)
  ],
  [(x) => ['.toml'].includes(x.extname),
    (x) => TOML.parse(x.content)
  ],
  [(x) => ['.json'].includes(x.extname),
    (x) => JSON.parse(x.content)
  ],
  [(x) => ['.xml'].includes(x.extname),
    (x) => XML.parse(x.content)
  ],
  [(x) => ['.html'].includes(x.extname),
    (x) => XML.parse(x.content)
  ],
  [(x) => ['.cbor'].includes(x.extname),
    (x) => dagCbor.decode(x.content)
  ],
  [(x) => ['.md'].includes(x.extname),
    (x) => {
      if( typeof x.content === "object") x.content = x.content.toString("utf8")
      const html = (marked.parse(x.content))
      const obj = XML.parse(html)
      return obj
    }
  ],
  [(x) => ['.dhall'].includes(x.extname),
    (x) => {
      if( typeof x.content === "object") x.content = x.content.toString("utf8")
      const access = fs.createWriteStream('/dev/null')
      const stdwriteOriginal = process.stdout.write
      process.stdout.write = process.stderr.write = access.write.bind(access)
      const { err, stdout, stderr } = shelljs.echo(x.content).exec('dhall-to-json', { silent: true })
      process.stdout.write = process.stderr.write = stdwriteOriginal
      return (JSON.parse(stdout))
    }
  ]
  ]
))

const load = R('pipe')(
  getDocument,
  parseDocument
)

module.exports = load
// url="https://github.com/well-typed/cborg/raw/master/cborg/tests/test-vectors/deriving/a-newtype"
// url="https://github.com/ipld/js-dag-cbor/raw/master/test/fixtures/obj-with-link.cbor"
// url="./spec/obj-with-link.cbor"
//url="./spec/packages.dhall"
//url="https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/master/spec/assets/mini-sample.xml"
//url="https://raw.githubusercontent.com/mithrayls/js-load-object/main/README.md"
url="./README.md"
load(url).then(console.log)

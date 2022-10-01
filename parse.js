const jsYaml = require('js-yaml')
const fs = require("fs")

const dagCbor = require('@ipld/dag-cbor')

const shelljs = require('shelljs')

const TOML = require('@iarna/toml')

const {XMLParser} = require('fast-xml-parser')
const options = {ignoreAttributes : false}
const XML = new XMLParser(options)

const marked = require("marked")

const parsers =
  { yaml: (x) => jsYaml.load(x)
  , yml: (x) => jsYaml.load(x)
  , toml: (x) => TOML.parse(x)
  , json: (x) => JSON.parse(x)
  , html: (x) => XML.parse(x)
  , xml: (x) => XML.parse(x)
  , cbor: (x) => dagCbor.decode(x)
  , md: (x) => XML.parse(marked.parse(x.toString("utf8")))
  , dhall: (x) => {
      if( typeof x === "object") x = x.toString("utf8")
      const access = fs.createWriteStream('/dev/null')
      const stdwriteOriginal = process.stdout.write
      process.stdout.write = process.stderr.write = access.write.bind(access)
      const { err, stdout, stderr } = shelljs.echo(x).exec('dhall-to-json', { silent: true })
      process.stdout.write = process.stderr.write = stdwriteOriginal
      return (JSON.parse(stdout))
    }
  }

module.exports = 
  (content,format) => parsers[format.replace("\.","")](content)



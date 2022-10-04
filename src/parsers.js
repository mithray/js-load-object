import { load as jsYaml } from "js-yaml"
import * as TOML from "@iarna/toml"
//import { XMLParser } from "fast-xml-parser"
//const XML = new XMLParser( {ignoreAttributes: false} )
import { marked } from "marked"
import { decode as cborDecode} from '@ipld/dag-cbor'
import shelljs from "shelljs"
import { createWriteStream } from "node:fs"
import * as parse5 from "parse5"

export const parsers =
  { yaml: (x) => jsYaml(x)
  , yml: (x) => jsYaml(x)
  , json: (x) => JSON.parse(x)
  , toml: (x) => TOML.parse(x)
  , html: (x) => parse5.parse(x)
  , xml: (x) => parse5.parse(x)
  , md: (x) => parse5.parse(marked.parse(x.toString("utf8")))
  , cbor: (x) => cborDecode(x)
  , dhall: (x) => {
      x = x.toString("utf8")
      const access = createWriteStream('/dev/null')
      const stdwriteOriginal = process.stdout.write
      process.stdout.write = process.stderr.write = access.write.bind(access)
      const { err, stdout, stderr } = shelljs.echo(x).exec('dhall-to-json', { silent: true })
      process.stdout.write = process.stderr.write = stdwriteOriginal
      return (JSON.parse(stdout))
    }
  }

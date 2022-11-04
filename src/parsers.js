import { createWriteStream } from "node:fs"

import { load as parseYAML } from "js-yaml"
import { parse as parseTOML } from "@iarna/toml"
import { marked } from "marked"
import { decode as cborDecode } from "@ipld/dag-cbor"
import shelljs from "shelljs"
import { pipe } from "ramda"
import { parse as parseHTML } from "parse5"
import * as cheerio from "cheerio"

const parseJSON = JSON.parse
//const parseHTML = (x) => cheerio.load(x)

// import { XMLParser } from "fast-xml-parser"
// const XML = new XMLParser( {ignoreAttributes: false} )
// import jc from 'json-cycle'
const parsers =
  { yaml: (x, parser) => parser ? parser(x) : parseYAML(x)
  , yml:  (x, parser) => parser ? parser(x) : parseYAML(x) 
  , json: (x, parser) => parser ? parser(x) : parseJSON(x)
  , toml: (x, parser) => parser ? parser(x) : parseTOML(x)
  , html: (x, parser) => parser ? parser(x) : parseHTML(x)
  , xml:  (x, parser) => parser ? parser(x) : parseHTML(x)
  , md:   (x, parser) => parser ? parser(x) : pipe(String, marked.parse, parseHTML)(x)
  , cbor: (x, parser) => parser ? parser(x) : cborDecode(x)
  , dhall: (string, parser) => {
    if (parser) return parser(x)
    const veryString = string.toString("utf8")

    const access = createWriteStream("/dev/null")
    const stdwriteOriginal = process.stdout.write

    process.stdout.write = access.write.bind(access)
    process.stderr.write = access.write.bind(access)

    const { stdout } = shelljs
      .echo(veryString)
      .exec("dhall-to-json", { silent: true })

    process.stdout.write = stdwriteOriginal
    process.stderr.write = stdwriteOriginal

    return JSON.parse(stdout)
  },
}

export default parsers

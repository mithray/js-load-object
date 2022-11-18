import { createWriteStream } from "node:fs"

import { load as parseYAML } from "js-yaml"
import { parse as parseTOML } from "@iarna/toml"
import { marked } from "marked"
import { decode as cborDecode } from "@ipld/dag-cbor"
import shelljs from "shelljs"
import { pipe } from "ramda"
import { parse as parseHTML } from "parse5"
import { XMLParser } from "fast-xml-parser"
//import * as cheerio from "cheerio"

 const parseXMLInstance = new XMLParser()
const parseXML = (str) => parseXMLInstance.parse(str)

const parseJSON = JSON.parse
//const parseHTML = (x) => cheerio.load(x)

// import { XMLParser } from "fast-xml-parser"
// const XML = new XMLParser( {ignoreAttributes: false} )
// import jc from 'json-cycle'
const parsers =
  { yaml: parseYAML
  , yml:  parseYAML
  , json: parseJSON
  , toml: parseTOML
  , html: parseHTML
  , xml:  parseXML
  , md:   pipe(String, marked.parse, parseHTML)
  , cbor: cborDecode
  , dhall: (string, parser) => {
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

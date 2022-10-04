import { createWriteStream } from "node:fs"

import { load as parseYAML } from "js-yaml"
import { parse as parseTOML } from "@iarna/toml"
import { marked } from "marked"
import { decode as cborDecode } from "@ipld/dag-cbor"
import shelljs from "shelljs"
import { parse as parseHTML } from "parse5"
import { pipe } from "ramda"

const parseJSON = JSON.parse

// import { XMLParser } from "fast-xml-parser"
// const XML = new XMLParser( {ignoreAttributes: false} )
// import jc from 'json-cycle'
const parsers = {
  yaml: parseYAML
  , yml: parseYAML
  , json: parseJSON
  , toml: parseTOML
  , html: parseHTML
  , xml: parseHTML
  , md: pipe(String, marked.parse, parseHTML)
  , cbor: cborDecode
  , dhall: (string) => {
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

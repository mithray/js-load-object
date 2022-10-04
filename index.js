import { readFile as readLocalDocument, readdir } from "node:fs/promises"
import { Buffer } from "node:buffer"
import { statSync } from "fs"
import * as path from "path"
import { andThen, cond, pipe, over, lensProp, assoc, filter, collectBy, map, mapObjIndexed, view, replace, tap } from "ramda"
import parsePath from "parse-path"
import undici from "undici"
//import { decycle } from "./src/cycle.js"
import jc from "json-cycle"

import { parsers } from "./src/parsers.js"
import { getFile } from "./src/getFile.js"
import { getFormat } from "./src/getFile.js"

//
// A Parser takes content in one format, returns in another
//

export const parseYaml = parsers["yaml"]
export const parseJson = parsers["json"]
export const parseToml = parsers["toml"]
export const parseHtml = parsers["html"]
export const parseXml  = parsers["xml"]
export const parseMd = parsers["md"]
export const parseCbor = parsers["cbor"]
export const parseDhall = parsers["dhall"]

//
// A Loader takes a URI, downloads it, parses it, returns it
//

const loaders = mapObjIndexed
  ( (parser,parserName,o) => pipe(getFile,andThen(parser))
  , parsers 
  )

export const loadYaml = loaders["yaml"]
export const loadJson = loaders["json"]
export const loadToml = loaders["toml"]
export const loadHtml = loaders["html"]
export const loadXml  = loaders["xml"]
export const loadMd = loaders["md"]
export const loadCbor = loaders["cbor"]
export const loadDhall = loaders["dhall"]

const url ="https://raw.githubusercontent.com/mithrayls/js-load-object/main/README.md"
export const load = x => loaders[getFormat(x)](x)
const res = jc.decycle(await load(url))
console.log(res)

import { andThen, pipe, mapObjIndexed, converge, applyTo, identity} from "ramda"
import { getFile, getFormat } from "./src/getFile.js"
import parsers from "./src/parsers.js"
import * as cheerio from "cheerio"

const loaders = mapObjIndexed(
  (parser) => pipe(getFile, andThen(parser)),
  parsers
)
const getLoader = (x) => loaders[getFormat(x)]

//
// A Loader takes a URI, downloads it, parses it, returns it
//

export const loadYaml = loaders.yaml
export const loadJson = loaders.json
export const loadToml = loaders.toml
export const loadHtml = loaders.html
export const loadXml = loaders.xml
export const loadMd = loaders.md
export const loadCbor = loaders.cbor
export const loadDhall = loaders.dhall

export const load = converge(applyTo, [identity, getLoader]) 

//
// A Parser takes content in one format, returns in another
//

export const parseYaml = parsers.yaml
export const parseJson = parsers.json
export const parseToml = parsers.toml
export const parseHtml = parsers.html
export const parseXml = parsers.xml
export const parseMd = parsers.md
export const parseCbor = parsers.cbor
export const parseDhall = parsers.dhall



//let x = (await load("http://example.com/index.html")).html()
//let x = (await load("http://example.com/index.html"))
//console.log(x)

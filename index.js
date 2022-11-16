import { tap, pickBy, zipObj, always, map, cond, andThen, pipe, mapObjIndexed, converge, applyTo, identity, equals, both} from "ramda"
import { getFile, getFormat } from "./src/getFile.js"
import parsers from "./src/parsers.js"
import { readdir } from "node:fs/promises"
import { lstatSync } from "node:fs"
import parsePath from "parse-path"

const loaders = mapObjIndexed
  ( (parser) => pipe(getFile, andThen(parser))
  , parsers
  )
const getLoader = (x) => loaders[getFormat(x)]

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

//
// A Loader takes a URI, downloads it, parses it, returns it
//

export const loadYAML   = loaders.yaml
export const loadJSON   = loaders.json
export const loadTOML   = loaders.toml
export const loadHTML   =
  (url, parser ) => parser 
    ? pipe(getFile,andThen(parser))(url)
    : pipe(getFile, andThen(parseHtml))(url)
export const loadXML    = loaders.xml
export const loadMD     = loaders.md
export const loadCBOR   = loaders.cbor
export const loadDHALL  = loaders.dhall

//export const load = converge(applyTo, [identity, getLoader]) 
const isFormat =
  (format) => (url) => equals(getFormat(url),format)

const isLocal =
  (url) =>  ["file"].includes(parsePath(url).protocol)

const isDirectory =
  (url) => lstatSync(url).isDirectory()

const loadDirectory = 
  /*
  pipe
  ( readdir
  , andThen( x => x.val ) 
  , andThen(map(async p => await load(url + "/" + p)))
  , andThen(tap(console.log))
  , andThen(Promise.all)
  , andThen(zipObj)
  )
  */
  async (url) => {
    let paths = (await readdir(url))
    let loadPath = async p => await load(url + "/" + p)
    let vals = await Promise.all(map(loadPath,paths))
    let obj = zipObj(paths,vals)
    obj = pickBy( (val,key) => val !== undefined, obj )
    return obj/// await readdir(url)
    
  }

export const load = 
  cond(
  [ [ both(isLocal,isDirectory) , loadDirectory  ]
  , [ isFormat("html")          , loadHTML       ]
  , [ isFormat("xml")           , loadXML        ]
  , [ isFormat("json")          , loadJSON       ]
  , [ isFormat("toml")          , loadTOML       ]
  , [ isFormat("yaml")          , loadYAML       ]
  , [ isFormat("yml")           , loadYAML       ]
  , [ isFormat("md")            , loadMD         ]
  , [ isFormat("dhall")         , loadDHALL      ]
  , [ isFormat("cbor")          , loadCBOR       ]
  , [ always(true)              , x => undefined ]
  ]
  )


//console.log(await load("./ignored"))

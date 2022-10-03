import { andThen, cond, pipe, over, lensProp, assoc, filter, collectBy, map } from "ramda"
import parsePath from "parse-path"
import undici from "undici"
import { readFile as readLocalFile, readdir } from "node:fs/promises"
import { statSync } from "fs"
import * as path from "path"
import parse from "./parse.js"
import { tap } from "ramda"
import { Buffer } from "node:buffer"

const setExtension = (x) => assoc("format",path.extname(x.href).replace(/^\./,""),x)
const readRemoteFile = pipe
  ( undici.request
  , andThen( (x) => x.body.text() )
  )
const fetchRemoteFile = pipe
  ( undici.fetch
  , andThen( (x) => x.body.getReader().read())
  , andThen( ({done, value}) => value)
  )

const readDirectory =
  async (href) => { 
    const paths = await readdir(href)
    const files = map(load,paths)
//    console.log(files)
    return files//Buffer.from("{}")
  }

const getDocument = cond(

      [ [ (x) => ["file"].includes(x.protocol) && statSync(x.href).isFile()
        , async (x) => ({...x, content: await readLocalFile(x.href)})
        ]

      , [ (x) => ["file"].includes(x.protocol) && statSync(x.href).isDirectory()
        , async (x) => ({...x, format: "json", content: await readDirectory(x.href)})
        ]

      , [ (x) => ["http", "https"].includes(x.protocol) && x.extname === "cbor"
        , async (x) => ({...x, content: await fetchRemoteFile(x.href)})
        ]

      , [ (x) => ["http", "https"].includes(x.protocol)
        , async (x) => ({...x, content: await readRemoteFile(x.href)})
        ]
      
      ]

  )

const load = pipe
  ( parsePath
  , setExtension
  , getDocument
  , andThen(tap(console.log))
  , andThen(parse)
  , andThen(tap(console.log))
  )

export default load

var url = "./package.json"
//load(url)
url = "./"
load(url)

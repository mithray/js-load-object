import { andThen, cond, pipe, over, lensProp, assoc } from "ramda"
import { tap } from "ramda"
import parsePath from "parse-path"
import undici from "undici"
import { readFile as readLocalFile } from "node:fs/promises"
import { statSync } from "fs"
import * as path from "path"
import parse from "./parse.js"

const setExtension = (x) => assoc("extname",path.extname(x.href).replace(/^\./,""),x)
const readRemoteFile = pipe
  ( undici.request
  , andThen( (x) => x.body.text() )
  )
const fetchRemoteFile = pipe
  ( undici.fetch
  , andThen( (x) => x.body.getReader().read())
  , andThen( ({done, value}) => value)
  )

const getDocument =
  cond(
      [ [ (x) => ["file"].includes(x.protocol) && statSync(x.href).isFile()
        , async (x) => ({...x, content: await readLocalFile(x.href)})
        ]

      , [ (x) => ["file"].includes(x.protocol) && statSync(x.href).isDirectory()
        , async (x) => ({...x, content: await readLocalFile(x.href)})
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
  , andThen(parse)
//  , (x) => x.content
  )

export default load

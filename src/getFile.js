import { andThen, cond, pipe, replace, when, ifElse /* map, zipObj */ } from 'ramda'
import parsePath from 'parse-path'
import undici from 'undici'
import { readFile /* readdir */ } from 'node:fs/promises'
import { statSync } from 'fs'
import * as path from 'path'
// import { Buffer } from 'node:buffer'

const readLocalBinary = readFile
const readLocalDocument = readFile
const readLocalDirectory =
  async (href) => {
    const obj = {}
    /*
    const paths = await readdir(href)
    const files = map(load, paths)
    const obj = zipObj(paths, files)
  */
    return obj// Buffer.from("{}")
  }
const readRemoteDocument = pipe((href) => when((href) => getFormat(href) === 'html' && path.extname(href) === '', (href) => path.join(href.replace(/\/$/, ''), 'index.html'))(href)
  , undici.request
  , andThen((x) => x.body.text())
)
const readRemoteBinary = pipe(undici.fetch
  , andThen((x) => x.body.getReader().read())
  , andThen(({ done, value }) => value)
)

export const getFormat = ifElse(href => ['http', 'https'].includes(parsePath(href).protocol) && path.extname(href.replace(parsePath(href).host, '')) === ''
  , href => 'html'
  , pipe(path.extname
    , replace(/^\./, '')
  )
)

const isRemoteDocument = (href) => ['http', 'https'].includes(parsePath(href).protocol)
const isRemoteBinary = (href) => ['http', 'https'].includes(parsePath(href).protocol) && getFormat(href) === 'cbor'
const isLocalDocument = (href) => ['file'].includes(parsePath(href).protocol) && statSync(href).isFile()
const isLocalBinary = (href) => ['file'].includes(parsePath(href).protocol) && statSync(href).isFile() && getFormat(href) === 'cbor'
const isLocalDirectory = (href) => ['file'].includes(parsePath(href).protocol) && statSync(href).isDirectory()

export const getFile = cond(
  [[isLocalDocument,
    readLocalDocument
  ],
  [isLocalBinary,
    readLocalBinary
  ],

  [isLocalDirectory,
    readLocalDirectory
  ],

  [isRemoteBinary,
    readRemoteBinary
  ],

  [isRemoteDocument,
    readRemoteDocument
  ]
  ])

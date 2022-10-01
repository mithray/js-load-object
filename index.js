const parse = require("./parse.js")
const memoizeWith = require('ramda/src/memoizeWith.js')
const parsePath = require('parse-path')
const undici = require('undici')
const fs = require('fs')
const path = require('path')

const R = (f) => memoizeWith(String, require(`ramda/src/${f}.js`))

const requestRemoteFile = R('pipe')(
  undici.request,
  R('andThen')((x) => x.body.text())
)

const fetchRemoteFile = R("pipe")(
  undici.fetch,
  R("andThen")( (x) => x.body.getReader()),
  R("andThen")( (x) => x.read()),
  R("andThen")( ({done, value}) => value)

)
/*
console.log(undici.file)
*/
const readLocalFile = (filePath) => fs.readFileSync(filePath)

const getDocument = R('ifElse')(
  (x) => R('equals')(parsePath(x).protocol, 'file'),
  async (x) => (
    {
      content: await readLocalFile(x),
      extname: path.extname(x)
    }),
  async (x) => (
    {
      content: (path.extname(x) === ".cbor") ? await fetchRemoteFile(x) : await requestRemoteFile(x),
      extname: path.extname(x)
    })
)

const parseDocument = (obj) => parse(obj.content,obj.extname)

const load = R('pipe')(
  getDocument,
  R("andThen")(parseDocument)
)

module.exports = load
//url="./README.md"
//url="https://raw.githubusercontent.com/mithrayls/js-load-object/main/README.md"
//requestRemoteFile(url).then( (x) => { 
//  return { content: x, extname } 
//})
//getDocument(url).then(parseDocument)

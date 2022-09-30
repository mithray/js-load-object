const load = require('../index.js')
const t = require('tap')

const urls =
  {
    json: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json',
    yaml: 'https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml',
    yml: 'https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml',
    toml: 'https://raw.githubusercontent.com/iarna/iarna-toml/latest/test/examples/hard_example.toml',
    xml: "https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/master/spec/assets/mini-sample.xml",
    html: "http://example.com/index.html",
    //    cbor: "https://github.com/ipld/js-dag-cbor/raw/master/test/fixtures/obj-with-link.cbor",
    dhall: 'https://raw.githubusercontent.com/purescript/spago/2a70306d87ddb2a7a61cf5ac61fccd7d91ecae6c/templates/packages.dhall'
  }

const filePaths =
  {
    json: './package.json',
    yaml: './spec/nodejs.yaml',
    yml: './spec/nodejs.yml',
    cbor: './spec/obj-with-link.cbor',
    dhall: './spec/packages.dhall',
    toml: './spec/hard_example.toml',
    html: "./spec/example.html",
    xml: "./spec/mini-sample.xml"
  }

const resultIsObject =
  async (x) => {
    const result = await load(x.url)
    t.equal(typeof result, 'object', 'Type ".' + x.type + '" should load as object')
  }

t.test('Remote Tests', async t => {
  Object.entries(urls).forEach(async x => {
    await resultIsObject({ type: x[0], url: x[1] })
  })
})

t.test('Local Tests', async t => {
  Object.entries(filePaths).forEach(async x => {
    await resultIsObject({ type: x[0], url: x[1] })
  })
})

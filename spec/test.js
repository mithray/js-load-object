const load = require('../index.js')
const t = require('tap')

const urls =
  {
    json: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.json',
    yaml: 'https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml',
    yml: 'https://raw.githubusercontent.com/gothinkster/realworld/main/api/openapi.yml',
    toml: 'https://raw.githubusercontent.com/iarna/iarna-toml/latest/test/examples/hard_example.toml',
    dhall: 'https://raw.githubusercontent.com/purescript/spago/2a70306d87ddb2a7a61cf5ac61fccd7d91ecae6c/templates/packages.dhall',
    cbor: 'https://github.com/ipld/js-dag-cbor/raw/master/test/fixtures/obj-with-link.cbor',
    xml: 'https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/master/spec/assets/mini-sample.xml',
    html: 'http://example.com/index.html',
    md: 'https://raw.githubusercontent.com/mithrayls/js-load-object/main/README.md'
  }

const filePaths =
  {
    json: './package.json',
    yaml: './spec/nodejs.yaml',
    yml: './spec/nodejs.yml',
    toml: './spec/hard_example.toml',
    dhall: './spec/packages.dhall',
    cbor: './spec/obj-with-link.cbor',
    xml: './spec/mini-sample.xml',
    html: './spec/example.html',
    md: './README.md'
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

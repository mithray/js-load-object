import { load } from '../index.js'
import t from 'tap'
import { writeFile as writeLocalFile } from 'node:fs/promises'
const urls = await load('./spec/test_urls.yaml')

const timestamp = Date.now()

t.test('Remote Tests', async t => {
  for (let i = 0; i < urls.length; i++) {
    const testDescription = 'Remote ' + urls[i].format + ' should load to an object'
    const res = await load(urls[i].path)
    t.test(testDescription, async t => t.equal(typeof res, 'object'))
    const tmpFileName = '/tmp/load-object-' + timestamp + '.' + urls[i].format
    writeLocalFile(tmpFileName, res.toString())
  }
})

/*
t.test('Local Tests', async t => {
  for(let i = 0; i < urls.length; i++){
    const testDescription = "Local " + urls[i].format + " should load to an object"
    const tmpFileName = "/tmp/load-object-"+timestamp+"-"+urls[i].path
    const res = await load(tmpFileName)
    t.test(testDescription, async t => t.equal(typeof res, 'object'))
  }
})
*/

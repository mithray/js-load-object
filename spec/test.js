import { writeFile as writeLocalFile } from "node:fs/promises"

import { test } from "tap"
import c from "ansi-colors"

import { load } from "../index.js"

const urls = await load("./spec/test_urls.yaml")

const timestamp = Date.now()

test("Remote Tests", async (tap) => {
  for (const url of urls) {
    const testDescription = `Remote ${c.blue(url.format)} should load to an object`
    const res = await load(url.path)

    tap.test(testDescription, async (tap) => tap.equal(typeof res, "object"))

    const temporaryFileName = `/tmp/load-object-${timestamp}.${url.format}`

    writeLocalFile(temporaryFileName, res.toString())
  }
})

//
// t.test('Local Tests', async t => {
// for(let i = 0; i < urls.length; i++){
//     const testDescription = "Local " + urls[i].format + " should load to an object"
//     const tmpFileName = "/tmp/load-object-"+timestamp+"-"+urls[i].path
//     const res = await load(tmpFileName)
//     t.test(testDescription, async t => t.equal(typeof res, 'object'))
// }
// })
//

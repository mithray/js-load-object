import { load } from "../index.js"
import { pipe } from "ramda"

const res = await pipe
  ( load
  , JSON.stringify
  , console.log(res)
  ) (process.argv[2])

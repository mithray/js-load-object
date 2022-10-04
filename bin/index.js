import { load } from "../index.js"
import { pipe } from "ramda"

pipe
  ( load
  , JSON.stringify
  , console.log
  ) (process.argv[2])

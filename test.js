import parsePath from "parse-path"
import { lstatSync } from "node:fs"

let url = "./"
let x = parsePath(url)
x = (lstatSync(url)).isDirectory()
console.log(x)

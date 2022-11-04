import * as cheerio from 'cheerio';

const loadHTML = cheerio.load

const obj = loadHTML('<ul id="fruits">...</ul>');

let x = obj.html()
console.log(x)


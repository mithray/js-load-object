import { readFile /* readdir */ } from "node:fs/promises";
import { statSync } from "node:fs";
import { extname, join } from "node:path";

import {
  andThen,
  cond,
  pipe,
  replace,
  when,
  ifElse /* map, zipObj */,
} from "ramda";
import parsePath from "parse-path";
import undici from "undici";

// import { Buffer } from 'node:buffer'

const readLocalBinary = readFile;
const readLocalDocument = readFile;

//
// const paths = await readdir(href)
// const files = map(load, paths)
// const obj = zipObj(paths, files)
//
const readRemoteDocument = pipe(
  (href) =>
    when(
      (href) => getFormat(href) === "html" && extname(href) === "",
      (href) => join(href.replace(/\/$/u, ""), "index.html")
    )(href),
  undici.request,
  andThen((response) => response.body.text())
);
const readRemoteBinary = pipe(
  undici.fetch,
  andThen((x) => x.body.getReader().read()),
  andThen(({ done, value }) => value)
);

const isRemoteDocument = (href) =>
  ["http", "https"].includes(parsePath(href).protocol);
const isRemoteBinary = (href) =>
  ["http", "https"].includes(parsePath(href).protocol) &&
  getFormat(href) === "cbor";
const isLocalDocument = (href) =>
  ["file"].includes(parsePath(href).protocol) && statSync(href).isFile();
const isLocalBinary = (href) =>
  ["file"].includes(parsePath(href).protocol) &&
  statSync(href).isFile() &&
  getFormat(href) === "cbor";
const isLocalDirectory = (href) =>
  ["file"].includes(parsePath(href).protocol) && statSync(href).isDirectory();

export const getFile = cond([
  [isLocalDocument, readLocalDocument],
  [isLocalBinary, readLocalBinary],

  //  [isLocalDirectory, readLocalDirectory],
  [isRemoteBinary, readRemoteBinary],
  [isRemoteDocument, readRemoteDocument],
]);

export const getFormat = ifElse(
  (href) =>
    ["http", "https"].includes(parsePath(href).protocol) &&
    extname(href.replace(parsePath(href).host, "")) === "",
  (href) => "html",
  pipe(extname, replace(/^\./u, ""))
);

"use strict";

const path = require("path");
const utilities = require("./utilities");

const thunkify = require("thunkify");
const co = require("co");

// 処理を全てthunkifyする事でcoが処理の終了を検知出来る
// 09_generatorの自作のasyncFlow関数がこの仕組みを解説している
const request = thunkify(require("request"));
const mkdirp = thunkify(require("mkdirp"));

const fs = require("fs");
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);

function* spiderLinks(currentUrl,body,nesting){
  if(nesting === 0){
    return nextTick();
  }
  const links = utilities.getPageLinks(currentUrl,body);
  for(let i = 0; i < links.length; i++){
    yield spider(links[i],nesting - 1);
  }
}

function* download(url,filename){
  console.log("Downloading " + url);
  const response = yield request(url);
  const body = response[1];
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename,body);
  console.log(`Downloaded and saved: ${url}`);
  return body;
}


function* spider(url,nesting){
  console.log("spider");
  const filename = utilities.urlToFilename(url);
  let body;
  try{
    // yieldを進めているのはco
    body = yield readFile(filename,"utf8");
  }catch(err){
    if(err.code !== "ENOENT") {
      throw err;
    }
    // yieldを進めているのはco
    body = yield download(url,filename);
  }
  // yieldを進めているのはco
  yield spiderLinks(url,body,nesting);
}

co(function* () {
  try {
    yield spider(process.argv[2], 1);
    console.log('Download complete');
  } catch(err) {
    console.log(err);
  }
});
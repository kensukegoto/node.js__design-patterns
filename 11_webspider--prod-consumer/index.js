"use strict";

const path = require('path');
const utilities = require('./utilities');
const thunkify = require('thunkify');
const co = require('co');
const request = thunkify(require('request'));
const fs = require('fs');
const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);
const TaskQueue = require('./TaskQueue');
const downloadQueue = new TaskQueue(2);


// サンク
function spiderLinks(currentUrl, body, nesting) {
  if(nesting === 0) {
    return nextTick();
  }
  
  // サンク
  // callbackが呼ばれるとspiderLinksを読んでいるyieldが解決
  return (callback) => {

    let completed = 0,hasErrors = false;
    let links = utilities.getPageLinks(currentUrl,body);
    if(links.length === 0){
      return process.nextTick(callback);
    }
    
    links.forEach(link => {
      downloadQueue.pushTask(function* (){
        // ページ取得
        yield spider(link,nesting - 1);
        done();
      });
    });

    function done(err,result){
      if(err && !hasErrors){
        hasErrors = true;
        callback(err);
      }
      if(++completed === links.length && !hasErrors){
        callback();
      }
    }

  }
}


function* download(url, filename) {
  console.log(`Downloading ${url}`);
  const results = yield request(url);
  const body = results[1];
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`Downloaded and saved: ${url}`);
  return body;
}


let spidering = new Map();
function* spider(url,nesting){
  if(spidering.has(url)){
    return nextTick();
  }
  spidering.set(url,true);

  let filename = utilities.urlToFilename(url);
  let body;
  try{
    body = yield readFile(filename,"utf8");
  }catch(err){
    if(err.code !== "ENOENT"){
      throw err;
    }
    body = yield download(url,filename);
  }
  yield spiderLinks(url,body,nesting);
}

co(function* (){
  try{
    yield spider(process.argv[2],1);
    console.log("Download complete");
  }catch(err){
    console.log(err);
  }
})
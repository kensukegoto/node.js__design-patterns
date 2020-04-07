"use strict";

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

const TaskQueue = require("./taskQueue");
let downloadQueue = new TaskQueue(2);


function spiderLinks(currentUrl,body,nesting,callback){
  if(nesting === 0){
    return process.nextTick(callback);
  }
  // aタグを集める
  const links = utilities.getPageLinks(currentUrl,body);
  if(links.length === 0){
    return process.nextTick(callback);
  }

  // そのページのリンクについての情報
  // ページ毎にこの変数が作成される（spiderLinksは実行される）
  let completed = 0,hasErrors = false;
  links.forEach(link => {
    // doneはコールバック callbackと言う名前が使用済のため
    downloadQueue.pushTask(done => { 
      spider(link,nesting - 1,err => {
        if(err){
          hasErrors = true;
          return callback(err);
        }
        if(++completed === links.length && !hasErrors){
          callback();
        }
        done();
      })
    })
  })


}


function saveFile(filename,contents,callback){
  mkdirp(path.dirname(filename),err => {
    if(err){
      return callback(err);
    }
    fs.writeFile(filename,contents,callback);
  });
}

function donwload(url,filename,callback){
  console.log(`Donwloading ${url}`);
  request(url,(err,response,body) => {
    if(err){
      return callback(err);
    }
    saveFile(filename,body,err => {
      if(err){
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null,body);
    })
  })
  
}

// urlの取得処理が既にされているか
let spidering = new Map();

function spider(url,nesting,callback){
  if(spidering.has(url)){
    return process.nextTick(callback);
  }
  spidering.set(url,true);

  const filename = utilities.urlToFilename(url);
  fs.readFile(filename,"utf8",(err,body)=>{

    // 多くはこれからファイルを取りに行くのでエラーになるでOK
    if(err){
      if(err.code !== "ENOENT"){
        return callback(err);
      }

      return donwload(url,filename,(err,body) => {
        if(err){
          return callback(err);
        }
        // downloadが終了したら下記の処理
        spiderLinks(url,body,nesting,callback);
      });
    } //if(err)

    spiderLinks(url,body,nesting,callback);

  });

}

spider(process.argv[2],1,err => {
  if(err){
    console.log(err);
    process.exit();
  }else{
    console.log("Download complete");
  }
});
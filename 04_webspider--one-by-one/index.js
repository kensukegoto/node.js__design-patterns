"use strict";

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const utilities = require("./utilities");

// ページをファイルに保存後に呼ばれる
function spiderLinks(currentUrl,body,nesting,callback){
  // console.log(callback);
  if(nesting === 0){
    return process.nextTick(callback);
  }
  // ページ内のaタグ取得
  let links = utilities.getPageLinks(currentUrl,body);
  function iterate(index){
    if(index === links.length){
      return callback();
    }
    spider(links[index],nesting - 1, err => {
      if(err){
        return callback(err);
      }
      iterate(index + 1);
    })
  }
  iterate(0);
}

// 保存
function saveFile(filename,contents,callback){
  mkdirp(path.dirname(filename),err => {
    if(err){
      return callback(err);
    }
    // spiderLinksの呼び出しはwriteFileが実行
    fs.writeFile(filename,contents,callback);
  })
}

// ダウンロード
function download(url,filename,callback){
  // console.log("download");
  request(url,(err,response,body)=>{
    if(err){
      return callback(err);
    }
    saveFile(filename,body,err => {
      if(err){
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null,body);
    });
  });
}


// 本体
function spider(url,nesting,callback) {

  const filename = utilities.urlToFilename(url);

  fs.readFile(filename,"utf8",function(err,body){
    if(err){
      if(err.code !== "ENOENT"){
        return callback(err);
      }
      // ダウンロード
      return download(url,filename,function(err,body){
        if(err){
          return callback(err);
        }
        // ダウンロード後
        spiderLinks(url,body,nesting,callback); // callbackは呼び出し時に渡しているもの
      });
    }

    spiderLinks(url,body,nesting,callback);

  });
}

// 呼び出し
spider(process.argv[2],1,err => {
  if(err) {
    console.log(err);
    process.exit();
  } else {
    console.log("Donload complete");
  }
})
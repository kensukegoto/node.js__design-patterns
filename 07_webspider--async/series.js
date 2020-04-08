"use strict";

// download関数でseriesを利用
// ダウンロード、保存、ページ内リンクの再起を実行
// seriesの各処理の第一引数には処理完了を通知するコールバックが
// seriesより渡させる

const request = require("request");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const async = require("async");
const utilities = require("./utilities");


function spiderLinks(currentUrl,body,nesting,callback){
  if(nesting === 0){
    return process.nextTick(callback);
  }
  let links = utilities.getPageLinks(currentUrl,body);
  function iterate(index){
    if(index === links.length){
      return callback();
    }
    spider(links[index],nesting - 1,function(err){
      if(err){
        return callback(err);
      }
      iterate(index + 1);
    });
  }
  iterate(0);
}


function download(url,filename,callback){
  console.log(`Downloading ${url}`);
  let body;

  async.series([
    done => {
      request(url,(err,response,resBody)=>{
        if(err){
          return done(err);
        }
        body = resBody;
        done();
      });
    },
    mkdirp.bind(null,path.dirname(filename)),
    done => {
      fs.writeFile(filename,body,done);
    }

  ],
  // コールバック
  function(err){
    if(err){
      return callback(err);
    }
    console.log(`Downloaded and saved: ${url}`);
    callback(null,body);
  })
}


function spider(url,nesting,callback){
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename,"utf8",(err,body)=>{
    if(err){
      // ENOENT means by No such file or directory
      if(err.code !== "ENOENT") {
        return callback(err);
      }
      // ダウンロード処理、終わったらコールバックでページ内のリンクを探し再起
      return download(url,filename,(err,body)=>{
        if(err){
          return callback(err);
        }
        spiderLinks(url,body,nesting,callback);
      })
    }
    spiderLinks(url,body,nesting,callback);
  })
}

spider(process.argv[2], 1, (err) => {
  if(err) {
    console.log(err);
    process.exit();
  } else {
    console.log('Download complete');
  }
});
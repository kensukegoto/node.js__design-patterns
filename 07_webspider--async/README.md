# series

配列に処理を入れ逐次処理。<br>
<br>
download関数でseriesを利用。ダウンロード、保存、ページ内リンクの再起を実行。seriesの各処理の第一引数には処理完了を通知するコールバックがseriesより渡させる

# eachSeries

`series`ではdonwload関数の処理を逐次処理するために`async`ライブラリを使用したが、ここでは、ページ内リンク取得時に使う

```js
function spiderLinks(currentUrl,body,nesting,callback){
  if(nesting === 0){
    return process.nextTick(callback);
  }
  let links = utilities.getPageLinks(currentUrl,body);

  // function iterate(index){
  //   if(index === links.length){
  //     return callback();
  //   }
  //   spiderLinks(links[index],nesting - 1,function(err){
  //     if(err){
  //       return callback(err);
  //     }
  //     iterate(index + 1);
  //   })
  // }
  // iterate(0);
  
  // doneはasyncライブラリより渡される各タスクの終了完了通知
  async.eachSeries(links,(link,done) => {
    spider(link,nesting - 1, done)
  },callback);
}
```

全コードは[こちら](https://github.com/mushahiroyuki/ndp2/blob/master/example/ch03/04_web_spider_v2/index.js)

# parallel

並行処理

```js
// doneはasyncライブラリより渡される各タスクの終了完了通知
async.each(links,(link,done)=>{
  spider(link,nesting - 1,done);
},callback);
```
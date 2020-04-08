# co

ジェネレーターとcoを使えば、同期処理を書くように非同期処理が書けるようになる

# 逐次処理

# 並行処理

ちなみに全く同じタイミングで同じurlを取りに行くような事が無いように05_parallelで使った`map`で処理したurlを管理しなければならない

## coに頼る

ジェネレーターは並行処理には向いていないがcoを利用するとそれが可能となる<br>
<br>
ジェネレーターの配列をyield出来る

```js
function* spiderLinks(currentUrl,body,nesting){
  if(nesting === 0){
    return nextTick();
  }
  const links = utilities.getPageLinks(currentUrl,body);
  const tasks = links.map(link => spider(link,nesting - 1));
  yield tasks;
}
```
## 並行処理の部分のみコールバックで実装

spiderLinksをジェネレターではなくサンクを返す関数として実装する事で処理終了を通知するコールバックを渡せる<br>
<br>
しかし
<br>
<br>
**co()がpromiseになりthenでcoによるコールバックを受け取れる部分がいまいち理解出来ていない**

```js
function spiderLinks(currentUrl,body,nesting){

  if(nesting === 0){
    return nextTick();
  }
  // サンク関数
  return callback => {

    let completed = 0,hasErrors = false;
    const links = utilities.getPageLinks(currentUrl,body);
    if(links.length === 0){
      return process.nextTick(callback);
    }
    // 各ページ取得後呼ばれる
    function done(err,result){
      if(err && !hasErrors){
        hasErrors = true;
        return callback(err):
      }
      // そのページの全てのリンクを処理したかどうか
      // 全て取得した場合にサンク終了を知らせるcallback
      if(++completed === links.length && !hasErrors){
        callback();
      }
    }
    for(let i = 0;i < links.length; i++){
      // 最初のページを呼び出した時と同じ事をする
      // co()はプロミスを返す（そう言うものである）
      co(spider(links[i],nesting - 1)).then(done);
    }
  } // サンク関数
}
```
# キュー

doneはTaskQueueから渡されるコールバック。このコールバックを呼ぶ事でTaskQueueにタスク終了を通知し、新しいタスクを呼べる状態になる

```js
~ 略 ~
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
~ 略 ~
```
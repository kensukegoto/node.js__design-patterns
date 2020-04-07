# 並行処理

処理する順番が重要で無い場合。複数のCPUを使うという意味の並列処理では無い事に注意

# 並行処理を一般化したパターン

下記の各taskはコールバックを受け取る。コールバック内で`completed`を更新する

```js
const tasks = [/* ... */];
let completed = 0;
tasks.forEach(task => {
  task(()=>{
    if(++completed === tasks.length){
      finish();
    }
  });
});
```

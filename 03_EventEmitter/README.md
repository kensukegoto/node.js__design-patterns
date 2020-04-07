# EventEmitterはコールバック関数の兄弟

何かの処理結果を扱う際にコールバックを使うか、EventEmitterを使うかの選択をする。main.jsは使い方の例、extends.jsはServerクラスに見られるような拡張した使い方の例

# EventEmitterに向く処理

処理内で何が起こったかなどに応じて複数のコールバックを書きたいような場合。参考として同じ結果を得るものをコールバックとEventEmitterの両方で下記に示す

```js
// EventEmitter
function helloEvents(){
  const eventEmitter = new EventEmitter();
  setTimeout(()=>eventEmitter.emit("hello","hello world"),100);
  return eventEmitter
}
// コールバック
function helloCallback(callback){
  setTimeout(() => callback("hello world"),100);
}
```
const fs = require("fs");
const cache = {};

function inconsistentRead(filename,callback){
  if(cache[filename]){
    process.nextTick(() => callback(cache[filename]));
  } else {
    fs.readFile(filename,"utf8",(err,data)=>{
      cache[filename] = data;
      callback(data);
    })
  }
}

// ファイルを読み込む
// 読み込んだことを通知する機能を持っている
function createFileReader(filename){
  const listeners = [];
  // 【非同期】この処理が終わる前に return される
  // しかし２回目はキャッシュがあるため同期処理になる
  inconsistentRead(filename,value => {
    listeners.forEach(listener => listener(value)) // 読み込んだデータをコールバックで処理
  });

  return {
    onDataReady: function(listener){ 
      return listeners.push(listener) 
    }
  }
}

const reader1 = createFileReader("data.txt");
// console.log(reader1)
reader1.onDataReady(data => {

  console.log(`First call data: ${data}`);
  
  // 同じ処理をあえて…
  const reader2 = createFileReader("data.txt");
  reader2.onDataReady( data => {
    console.log(`Second call data: ${data}`);
  })

})
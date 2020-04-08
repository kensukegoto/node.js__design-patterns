// 3.ジェネレーターを使った非同期制御
(()=>{
  const fs = require("fs");
  const path = require("path");

  function asyncFlow(generatorFunc){
    /**
     * 1.ジェネレーターに渡すコールバックを定義
     * 2.ジェネレーターを起動
     * 3.コールバック内で自身（ジェネレーター）を進める
     */
    function callback(err){
      if(err){
        return generator.throw(err);
      }
      const results = [].slice.call(arguments,1); // arguments[0]はerr
      // 次の処理に前の処理の結果（つまり前の処理のコールバックに渡るデータ）を渡す
      // e.g.
      // readFileの場合コールバックに渡る引数はerrとdataなのでdataが.nextに渡る
      generator.next(results.length > 1 ? results : results[0]); 
    }
    const generator = generatorFunc(callback);
    generator.next();
  }

  asyncFlow(function* (callback){

    const fileName = path.basename(__filename); // __filenameは自身のファイル名
    // 同期処理のような書き方が実現出来ているのは
    // 非同期処理の終了後のコールバック関数内でジェネレーターを進める記述をしている
    const myself = yield fs.readFile(fileName,"utf8",callback);
    yield fs.writeFile(`clone_of_${fileName}`,myself,callback);
    console.log("Clone created");
   
  })
})();

// 1.ジェネレーターの基本を確認
(()=>{
  return;
  function* iteratorGenerator(arr){
    for(let i = 0;i < arr.length; i++){
      yield arr[i];
    }
  }
  const iterator = iteratorGenerator([
    "apple",
    "orange",
    "watermelon"
  ]);
  let currentItem = iterator.next();
  while(!currentItem.done){
    console.log(currentItem.value);
    currentItem = iterator.next();
  }
})();

// 2.ジェネレーターがコールバックを受け取り最後にコールバックを実行する
(()=>{

  return;

  function* iteratorGenerator(arr,callback){
    for(let i = 0;i < arr.length; i++){
      yield arr[i];
    }
    callback();
  }

  function run(gen,arr){
    
    const iterator = gen(arr,()=>{
      console.log("終わった！");
    });

    let currentItem = iterator.next();
    while(!currentItem.done){
      console.log(currentItem.value);
      currentItem = iterator.next();
    }
  };

  run(
    iteratorGenerator,
    [
      "apple",
      "orange",
      "watermelon"
    ]
  );

})();
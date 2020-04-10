"use strict";

const co = require("co");


// タスクは非同期処理を順に実行するジェネレーター
class TaskQueue {

  constructor(cocurrency){
    this.cocurrency = cocurrency;
    this.runnig = 0;
    this.taskQueue = [];
    this.consumerQueue = []; // 実行
    this.spawnWorkers(cocurrency);
  }

  // 初期化時に起動される
  spawnWorkers(cocurrency){
    const self = this;
    for(let i = 0; i < cocurrency; i++){
      // 制限分だけcoを起動
      // ２つまで実行ならば２つのcoが実行
      // この２つのcoにタスクが順に入っていく
      co(function* (){
        while(true){
          const task = yield self.nextTask(); // nextTaskのcallbackが呼ばれない限りここで止まる
          yield task; // task()としないでも実行される？
        }
      })
    }
  } // spawnWorkers

  // タスクを入れていなくても起動時に実行される
  // つまりアイドル状態にする？
  nextTask(){
    return callback => {
      if(this.taskQueue.length !== 0){
        return callback(null,this.taskQueue.shift());
      }
      this.consumerQueue.push(callback); // 終了したよを宣言する関数を入れる
    }
  }

  pushTask(task){
    // すぐ実行出来る状態
    if(this.consumerQueue.length !== 0){
      // アイドル状態を終了
      // nullはエラー、taskはPromiseの結果オブジェクト
      // つまりconst task = yield self.nextTask(); のtaskに戻り値として入る
      this.consumerQueue.shift(null,task); 
    } else {
    // 待たないといけない状態はtaskを配列に入れて終了
    // 取り出しの処理はspawnWorkersのco内でしている
      this.taskQueue.push(task);
    }
  }

}

module.exports = TaskQueue;
module.exports = class TaskQueue {
  constructor(concurrency){
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  pushTask(task){
    this.queue.push(task);
    // タスクを待ちに入れたらそのまま実行出来るかトライ
    this.next();
  }
  // 制限いっぱいになるまでタスクを起動する
  next(){
    // 既に制限に達していたら何もしない
    while(this.running < this.concurrency && this.queue.length){
      // １つ取り出す
      const task = this.queue.shift();
      task(()=>{
        this.running--;
        this.next();
      });
      this.running++;
    }
  }
}
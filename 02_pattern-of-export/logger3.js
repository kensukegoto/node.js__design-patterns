class Logger {
  constructor(name){
    this.name = name;
  }
  log(message){
    console.log(`[${this.name}] ${message}`);
  }
  info(message){
    this.log(`概要: ${message}`);
  }
  verbose(message){
    this.log(`詳細: ${message}`);
  }
}

module.exports = Logger

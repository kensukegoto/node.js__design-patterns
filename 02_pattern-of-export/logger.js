exports.info = message => {
  console.log("概要: " + message + " from logger");
}
exports.verbose = message => {
  console.log("詳細: " + message + " from logger");
}
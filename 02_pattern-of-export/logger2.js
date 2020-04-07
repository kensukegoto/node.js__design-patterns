module.exports = message => {
  console.log(`概要: ${message} from logger2`);
}

module.exports.verbose = message => {
  console.log(`詳細: ${message} from logger2`);
}
"ust strict";

const path = require('path');
const utilities = require('./utilities');
const thunkify = require('thunkify');
const co = require('co');
const request = thunkify(require('request'));
const fs = require('fs');
const mkdirp = thunkify(require('mkdirp'));
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);

// function thunk (){
//   console.log("thunk");
//   return cb => {
//     console.log("thunk cb");
//     cb();
//   }
// }

// function* gen(){
//   console.log("gen");
//   yield thunk;
// }

// co(function* (){
//   yield gen();
// }).then(cb => {
//   console.log(cb);
// })



// #@@range_begin(list1)
function spiderLinks(currentUrl, body, nesting) {
  if(nesting === 0) {
    return nextTick();
  }

  //returns a thunk
  return callback => {
    console.log("returns a thunk");
    let completed = 0, hasErrors = false;
    const links = utilities.getPageLinks(currentUrl, body);
    if (links.length === 0) {
      return process.nextTick(callback);
    }

    function done(err, result) {
      if(err && !hasErrors) {
        hasErrors = true;
        return callback(err);
      }
      if(++completed === links.length && !hasErrors) {
        callback();
      }
    }

    for(let i = 0; i < links.length; i++) {
      co(spider(links[i], nesting - 1)).then(done);
    }
  }
}
// #@@range_end(list1)

function* download(url, filename) {
  console.log(`Downloading ${url}`);
  const results = yield request(url);
  const body = results[1];
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`Downloaded and saved: ${url}`);
  return body;
}

const spidering = new Map();
function* spider(url, nesting) {
  if(spidering.has(url)) {
    return nextTick();
  }
  spidering.set(url, true);
  
  const filename = utilities.urlToFilename(url);
  let body;
  try {
    body = yield readFile(filename, 'utf8');
  } catch(err) {
    if(err.code !== 'ENOENT') {
      throw err;
    }
    body = yield download(url, filename);
  }
  yield spiderLinks(url, body, nesting);
}

co(function* () {
  try {
    yield spider(process.argv[2], 2);
    console.log('Download complete');
  } catch(err) {
    console.log(err);
  }
});
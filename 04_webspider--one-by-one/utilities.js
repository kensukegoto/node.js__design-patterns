"use strict";

// hostnameなどにurlを分解してくれる
const urlParse = require("url").parse;
// url.resolve('http://example.com/', '/one');  とすると 'http://example.com/one'
const urlResolve = require("url").resolve;
const slug = require("slug");
const path = require("path");
const cheerio = require("cheerio");

// console.log(urlParse("https://news.yahoo.co.jp/pickup/6356446"));

module.exports.urlToFilename = function urlToFilename(url){
  // https://news.yahoo.co.jp/pickup/6356446ならば/pickup/6356446
  const parsedUrl = urlParse(url);
  const urlPath = parsedUrl.path.split("/")
    .filter(component => component !== "")
    .map(component => slug(component))
    .join("/");
  let filename = path.join(parsedUrl.hostname,urlPath);
  if(!path.extname(filename).match(/htm/)){
    filename += ".html";
  }
  return filename;
}


module.exports.getLinkUrl = function getLinkUrl(currentUrl, element) {
  const link = urlResolve(currentUrl, element.attribs.href || "");
  const parsedLink = urlParse(link);
  const currentParsedUrl = urlParse(currentUrl);
  if(parsedLink.hostname !== currentParsedUrl.hostname
    || !parsedLink.pathname) {
    return null;
  }
  return link;
};

module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(function(element) {
      
      // return module.exportsとしているのは「getLinkUrl」がmodule.exportsのプロパティとしてのみ存在しているから
      return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element) {
      return !!element;
    });
};
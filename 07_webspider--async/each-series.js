function spiderLinks(currentUrl,body,nesting,callback){
  if(nesting === 0){
    return process.nextTick(callback);
  }
  let links = utilities.getPageLinks(currentUrl,body);

  // function iterate(index){
  //   if(index === links.length){
  //     return callback();
  //   }
  //   spiderLinks(links[index],nesting - 1,function(err){
  //     if(err){
  //       return callback(err);
  //     }
  //     iterate(index + 1);
  //   })
  // }
  // iterate(0);
  async.eachSeries(links,(link,done) => {
    spider(link,nesting - 1, done)
  },callback);
}
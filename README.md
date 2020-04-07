# exportsとmodule.exportsの違いは？

用途は同じだが使い方に違いがある。

```js
// exports
// exportsと言う特別なオブジェクトのnameプロパティに代入する事で外に出せる
// console.log(exports)とするとオブジェクトである
exports.name = "ken";

// module.exports
// moduleと言う特別なオブジェクトのexportsと言うプロパティに代入する事で外に出せる
// console.log(module.exports)とすると実態が見えやすい
module.exports = "ken";
// もしくは
// moduleと言う特別なオブジェクトのexportsと言うプロパティに代入する事で外に出せる
// 更に出すものをキー・バリューで仕分けする
module.exports.name = "ken";
```

# オブジェクトのエクスポート

# 関数のエクスポート

module.exports = ○○でメインの機能を、module.exports.△△ = □□でサブの機能をexportsする

# クラスのエキスポート

# インスタンスのエキスポート

requireのキャッシュ機能が効きプログラム全体で同じインスタンスを参照出来る

# 何もエキスポートしない

モジュール内でモジュールのrequireとその拡張をする例を取る。メインの処理の中でこのモジュールと更にモジュール内で読んだモジュールを読む。先に読んだモジュールがキャッシュとして残るため、あとに読んだモジュールは拡張したものとなる。
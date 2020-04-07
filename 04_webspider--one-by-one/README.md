# cheerioでスクレーピング

`request`モジュールとセットで使う。`request`で取得した結果を`cheerio`で構造化しスクレーピングするイメージ<br>
<br>
utilities.jsの中で使用

# requestでhttpリクエスト

utilities.jsの中で使用

# slugで空白を"-"に変更

utilities.jsの中で使用しているが恐らく保険のためで意味が無い

# mkdirp

/foo/bar/baz/index.htmlのように階層構造のあるファイルを保存する際に使う。まずmkdirpで階層を作り、fs.writeFileなどでそこにファイルを作成・保存する
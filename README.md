
# このアプリについて

 このアプリは漫画の出版日を収集、通知することを目的としています。

 TypeScriptで作成しているので、従来に比べてより安全、より容易に開発者はアプリを拡張していくことが可能です。


## 開発者向け

### 始め方

#### クローラー

Node12以降で動作します。
[ts-node](https://github.com/TypeStrong/ts-node)を利用しているので実行コードはTypeScriptで記述可能です。

以下のコマンドを実行することで動作します。

実行した結果はjson形式で実行プログラムと同一階層のdataフォルダー内へと配置されます。

```bash
$ cd crawler
$ npm i
$ npm run tsNode 実行したいコードの相対パス
```

# Nuxt.js project

## Build Setup

```bash
# install dependencies
$ yarn install
$ cd server
$ yarn install
$ cd ..

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

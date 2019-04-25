const fs = require('fs')
const client = require('cheerio-httpcli')

client.download
  .on('ready', (stream) => {
    const searchValue = /.*\/(\w*?)\/(\w*?).png$/
    const path = `./images/${stream.url.href.replace(searchValue, '$1')}`
    const name = stream.url.href.replace(searchValue, '$2.png')
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    // stream.pipeを利用するとダウンロードした画像が荒れるため、toBufferを使う
    stream.toBuffer(function (err, buffer) {
      fs.writeFileSync(`${path}/${name}`, buffer, 'binary')
    })
  })
  .on('error', (err) => {
    console.error(`${err.url} can't downloaded. ${err.message}`)
  })

client.download.parallel = 1

// 1周年記念オリジナル壁紙・SNSアイコン配布のページ
client.fetch('https://lovelive-puchiguru.jp/campaign/5c81dedf.html')
  .then((result) => {
    result.$('.campaignDetail').find('a').each((idx, elm) => {
      const $elm = result.$(elm)
      // 各リンクに遷移
      client.fetch($elm.attr('href'))
        .then((res) => {
          // アイコンのダウンロード
          res.$('.img-responsive').download()
        })
    })
  })

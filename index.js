const fs = require('fs');
const client = require('cheerio-httpcli')

client.download
  .on('ready', (stream) => {
    const path = `./images/${stream.url.href.replace(/.*\/(\w*?)\/(\w*?).png$/, '$1')}`
    const name = stream.url.href.replace(/.*\/(\w*?)\/(\w*?).png$/, '$2.png')
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    stream.toBuffer(function (err, buffer) {
      fs.writeFileSync(`${path}/${name}`, buffer, 'binary');
    });
  })
  .on('error', (err) => {
    console.error(`${err.url} can't downloaded. ${err.message}`)
  })

client.download.parallel = 1

client.fetch('https://lovelive-puchiguru.jp/campaign/5c81dedf.html')
  .then((result) => {
    result.$('.campaignDetail').find('a').each((idx, elm) => {
      const $elm = result.$(elm)
      client.fetch($elm.attr('href'))
        .then((res) => {
          res.$('.img-responsive').download()
        })
    })
  })

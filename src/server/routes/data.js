const express = require('express');
const fs = require('fs');
const jsdom = require('jsdom');

const fetchHelper = require('../helpers/fetch');
const fileHelper = require('../helpers/file');

const router = express.Router();
const { JSDOM } = jsdom;

// GET /data/{lineNo}
router.get('/:line', async (req, res) => {
  const filename = `./data/${req.params.line}.txt`;
  res.set('Content-Type', 'application/json');
  let body = {};
  if (fs.existsSync(filename)) {
    body.body = await fileHelper.readFile(filename);
    body.status = '';
  } else {
    body.status = 'nonexist';
  }
  body.id = `${req.params.line}`;
  res.send(body);
});

// POST /data/{lineNo}
router.post('/:line', async (req, res) => {
  const lineNo = req.params.line;

  // TODO : Help function을 이용하여, 주어진 filename에 내용을 저장할 수 있도록 구현하세요.
  /*
   * Hint : Helper function(readLineFromSourceList, retrieveArticle, wrtieFile)이 필요할 것 입니다.
   * 1) 주어진 lineNo를 통해, 해당 line에 존재하는 url를 얻는다.
   * 2) url을 통해, article contents를 얻어낸다. ( JSDOM을 이용하여, medium 블로그의 글 내용을 얻을 수 있도록 하세요.)
   * 3) 얻어낸 article contents를 저장한다. (ex : filename , data/${lineNo}.txt)
   */
  try {
    let url = await fileHelper.readLineFromSourceList(lineNo);
    let string = await fetchHelper.retrieveArticle(url);
    let dom = new JSDOM(string);

    let tempURL = url.split('.')[0];
    let article = '';
    switch (tempURL) {
      case 'https://medium':
        article = dom.window.document.querySelector('article').textContent;
        break;
      case 'https://velog':
        article = dom.window.document.querySelector('.sc-esjQYD').textContent;
        break;
      default:
        break;
    }

    let result = await fileHelper.writeFile(
      `./data/${lineNo}.txt`,
      JSON.stringify(article)
    );
    res.send('ok');
  } catch (error) {
    res.status(404).send('Not found');
  }
});

module.exports = router;

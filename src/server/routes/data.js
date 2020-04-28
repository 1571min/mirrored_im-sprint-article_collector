const express = require("express");
const fs = require("fs");
const jsdom = require("jsdom");

const fetchHelper = require("../helpers/fetch");
const fileHelper = require("../helpers/file");

const router = express.Router();
const { JSDOM } = jsdom;

// GET /data/{lineNo}
router.get("/:line", async (req, res) => {
  const filename = `./data/${req.params.line}.txt`;
  res.set("Content-Type", "application/json");

  // TODO : Help function을 이용하여, 주어진 filename의 내용을 읽을 수 있도록 구현하세요.
  /*
   * fs.existsSync 를 이용하여, 존재하지 않는 파일에 대해서 에러 핸들링을 할 수 있어야 합니다.
   */
  //console.log(fs.existsSync(filename))
  if (fs.existsSync(filename)) {
    fileHelper.readFile(filename)
    .then(data => 
        res.send({body: data})
    )
  } else { 
    res.set("Content-Type","text/plain")
    res.status(404).send('not found')}
});

// POST /data/{lineNo}
router.post("/:line", async (req, res) => {
  const lineNo = req.params.line;

  // TODO : Help function을 이용하여, 주어진 filename에 내용을 저장할 수 있도록 구현하세요.
  /*
   * Hint : Helper function(readLineFromSourceList, retrieveArticle, wrtieFile)이 필요할 것 입니다.
   * 1) 주어진 lineNo를 통해, 해당 line에 존재하는 url를 얻는다.
   * 2) url을 통해, article contents를 얻어낸다. ( JSDOM을 이용하여, medium 블로그의 글 내용을 얻을 수 있도록 하세요.)
   * 3) 얻어낸 article contents를 저장한다. (ex : filename , data/${lineNo}.txt)
   */
  fileHelper.readLineFromSourceList(lineNo)
  .then(url => fetchHelper.retrieveArticle(url))
  .then(string => new JSDOM(string))
  .then(dom => {
    let article = dom.window.document.querySelector('article').textContent
    fileHelper.writeFile(`./data/${lineNo}.txt`,JSON.stringify(article))
    res.send('완료')}
  
  )
  // eslint-disable-next-line no-console
  .catch(err => {console.log(err); res.status(404).send('not found')})

});

module.exports = router;

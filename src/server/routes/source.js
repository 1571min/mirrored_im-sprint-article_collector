const express = require("express");
const fileHelper = require("../helpers/file");

const router = express.Router();

// GET /source
router.get("/", async (req, res) => {
  // TODO: Help function을 이용하여, source.txt의 내용을 반환 수 있도록 구현하세요.
  fileHelper.readSourceListFile()
  .then(sourceText => res.send(sourceText))
  
});

// POST /source
router.post("/", async (req, res) => {
  // TODO: Help function을 이용하여, source.txt의 내용으로 저장할 수 있도록 구현하세요.
  fileHelper.writeSourceListFile(req.body)
  .then(sourceText => res.send(sourceText))
});

module.exports = router;

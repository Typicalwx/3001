var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post("/upload", async function (req, res) {
  let form = new multiparty.Form({
    uploadDir: "./public/upload"//手动在public下建一个upload文件，图片上传会存到这个文件
  });
  form.parse(req, function (err, fields, files) {
    console.log(files); //{[{}]}的形式
    let key = Object.keys(files)[0];
    if (err) {
      res.send(err);
    } else {
      // res.send(path.basename(files.uploadHeader[0].path));//path是文件名
      res.send(path.basename(files[key][0].path))//这种方法解决上传时不同的name
    }
  })
})
module.exports = router;

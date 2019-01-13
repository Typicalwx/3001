var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
const multiparty = require("multiparty");
const path = require("path");


router.get('/getsession', function (req, res) {
  res.send(req.session.users)

  //老师的方法  注意点1
 // res.send(req.session.users||{})
 //在index.hmtl的老师的老师方法把注销打开
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
});

router.get('/platform', async function (req, res) {
  let { page, rows, type, value, boll } = req.query;
  let searchObj = {};
  let arr = [];
  if (type) {
    searchObj = { [type]: value };
  }

  if (boll) {
    let data = await client.get('/users', { ...searchObj });
    for (let i = 0; i < data.length; i++) {
      if (data[i].state == 0 &&
        (data[i].role == "门店管理员" || data[i].role == "供应商管理员")) {
        arr.push(data[i]);
      }
    }
    let rowsData = []
    for (let i = (page - 1) * rows; i < rows * page; i++) {
      if (i < arr.length) {
        rowsData.push(arr[i])
      } else {
        break;
      }
    }
    let maxpage = Math.ceil(arr.length / rows);
    let dataLast = {
      curpage: page,
      eachpage: rows,
      maxpage: maxpage,
      rows:
        rowsData,
      total: arr.length
    }
    res.send(dataLast)
  } else {
    let data = await client.get('/users/', { page, rows, ...searchObj });
    res.send(data);
  }
});



router.get('/remove', function (req, res) {
  delete req.session.users;
 
  res.send({ status: 1 })
  //老师的方法，req.session.user=null 注意点1
});

router.put('/:id', async function (req, res, next) {
  let id = req.params.id
  let { xiangqingstate } = req.body
  console.log(id,xiangqingstate)
 let data =  await client.put("/users/" + id, {
    xiangqingstate
  });
  console.log("修改后的data",data)
  res.send({ status: 1 })
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

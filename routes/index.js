var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

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

module.exports = router;

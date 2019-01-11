var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */

// 增加用户
router.post("/", async function (req, res) {
  let { account, pwd, email, phone, name, role, state } = req.body;
  await client.post("/users", { account, pwd, email, phone, name, role, state });
  res.send({
    status: 1
  })
})
// 修改用户
router.put('/:id', async function (req, res, next) {
  let id = req.params.id
  let { account, pwd, email, phone, name, role, state } = req.body
  await client.put("/users/" + id, { account, pwd, email, phone, name, role, state })
  res.send({ status: 1 });
});

// 通过id查询用户
router.get('/:id', async function (req, res, next) {
  let id = req.params.id
  let data = await client.get("/users/" + id)
  res.send(data);
});

// 查询所有用户
// router.get('/', async function (req, res, next) {
//   let { type, value } = req.query
//   let data = await client.get("/users", { type, value })
//   res.send(data);
// });
router.get('/', async function (req, res) {
  let { page, rows, type, value, boll } = req.query;
  let searchObj = {};
  let arr = [];
  if (type) {
    searchObj = { [type]: value };
  }
  if (boll) {
    let data = await client.get('/users/', { ...searchObj });
    for (let i = 0; i < data.length; i++) {
      if (data[i].role == "普通会员" || data[i].role == "平台管理员") {
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
// router.get('/platform', async function (req, res) {
//   console.log(1)
//   let { page, rows, type, value, boll } = req.query;
//   console.log(page, rows, type, value, boll)
//   let searchObj = {};
//   let arr = [];
//   if (type) {
//     searchObj = { [type]: value };
//   }

//   if (boll) {
//     let data = await client.get('/users', { ...searchObj });
//     for (let i = 0; i < data.length; i++) {
//       if (data[i].role == "门店管理员" || data[i].role == "供应商管理员") {
//         arr.push(data[i]);
//       }
//     }
//     let rowsData = []
//     for (let i = (page - 1) * rows; i < rows * page; i++) {
//       if (i < arr.length) {
//         rowsData.push(arr[i])
//       } else {
//         break;
//       }
//     }
//     let maxpage = Math.ceil(arr.length / rows);
//     let dataLast = {
//       curpage: page,
//       eachpage: rows,
//       maxpage: maxpage,
//       rows:
//         rowsData,
//       total: arr.length
//     }
//     console.log(dataLast, 89)
//     res.send(dataLast)
//   } else {
//     let data = await client.get('/users/', { page, rows, ...searchObj });
//     res.send(data);
//   }
// });
module.exports = router;

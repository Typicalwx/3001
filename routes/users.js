var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */



//判断电话号码重复
router.get('/phone', async function (req, res) {
  let { phone } = req.query;
  let data = await client.get("/users", { phone, findType: "exact" });
  console.log(data)
  if (data.length > 0) {
    res.send({
      status: 0
    });
  } else {
    res.send({
      status: 1
    });
  }
});


//判断登录名是否重复
router.get('/account', async function (req, res) {
  let { account } = req.query;
  let data = await client.get("/users", { account, findType: "exact" });
  if (data.length > 0) {
    res.send({
      status: 0
    });
  } else {
    res.send({
      status: 1
    });
  }
});

// 增加用户
router.post("/", async function (req, res) {
  let { account, pwd, email, phone, name, role, state } = req.body;
  let data = await client.post("/users", { account, pwd, email, phone, name, role, state });
  res.send(
    data
  )
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







router.post('/login', async function (req, res) {
  let { account, pwd } = req.body;
  let data = await client.get("/users", { account, pwd, findType: "exact" });
  console.log(data, 123123123)
  if (data.length > 0) {
    // console.log(data);
    req.session.users = data[0];
    res.send(data[0])
  } else {
    // console.log(data);
    res.send({
      stats: 0
    })
  }
})





// router.post("/petmaster", async function (req, res) {
//   let { name, phone, pwd, addr } = req.body;
//   await client.post("/petmaster", { name, phone, pwd, addr })
//   res.send({
//     stats: 1
//   })
// })

// router.post('/shangping', async function (req, res, next) {
//   console.log(req.body)
//   let { storeId, name, price } = req.body
//   let data = await client.post("/storegoods", {
//     name, price,
//     stores: {
//       $ref: "stores",
//       $id: storeId
//     }
//   });
//   console.log(data)
//   res.send({ status: 1 })
// });


module.exports = router;

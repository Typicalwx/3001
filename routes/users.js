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

//判断电话号码重复
router.get('/phone', async function (req, res) {
  let { phone } = req.query;
  let data = await client.get("/users", { phone, findType: "exact" });
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
router.get('/:id', async function (req, res, next) {
  let id = req.params.id
  let data = await client.get("/users/" + id)
  res.send(data);
});

// 查询所有用户
router.get('/', async function (req, res, next) {
  let data = await client.get("/users")
  res.send(data);
});



router.post('/login', async function (req, res) {
  let { account, pwd } = req.body;
  let data = await client.get("/users", { account, pwd, findType: "exact" });
  console.log(data, 123123123)
  if (data.length > 0) {
    console.log(data);
    req.session.users = data[0];
    res.send({
      data,
      stats: 1
    })
  } else {
    // console.log(data);
    res.send({
      stats: 0
    })
  }
})


module.exports = router;

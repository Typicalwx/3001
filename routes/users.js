var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */

// 增加用户
router.post("/", async function (req, res) {
  let { account, pwd, email, phone, name, role, state } = req.body;
  let data = await client.post("/users", { account, pwd, email, phone, name, role, state });
  res.send({
    data
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
router.get('/', async function (req, res, next) {
  let data = await client.get("/users")
  res.send(data);
});
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

router.post('/login', async function (req, res) {
  let { account, pwd } = req.body;
  let data = await client.get("/users", { account, pwd, findType: "exact" });
  console.log(data)
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

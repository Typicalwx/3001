var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/", async function (req, res) {
  let { phone, pwd } = req.body;
  await client.post("/stores", { phone, pwd })
  res.send({
    stats: 1
  })
})

router.post("/petmaster", async function (req, res) {
  let { phone, pwd } = req.body;
  await client.post("/petmaster", { phone, pwd })
  res.send({
    stats: 1
  })
})

router.post('/shangping', async function (req, res, next) {
  console.log(req.body)
  let { storeId, name,  price } = req.body
  let data = await client.post("/storegoods", {
      name,price, 
      stores: {
          $ref:"stores",
          $id: storeId
      }
  });
  console.log(data)
  res.send({ status: 1 })
});


module.exports = router;

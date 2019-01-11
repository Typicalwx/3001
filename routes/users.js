var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
/* GET users listing. */
router.get('/',async function(req,res){
  let {phone} = req.query;
  let data = await client.get("/wlm",{phone,findType:"exact"});
  if(data.length > 0){
      res.send({
          status:0
      });
  }else{
      res.send({
          status:1
      });
  }
});

router.get('/account',async function(req,res){
  let {account} = req.query;
  let data = await client.get("/wlm",{ account , findType:"exact"});
  if(data.length > 0){
      res.send({
          status:0
      });
  }else{
      res.send({
          status:1
      });
  }
});
router.post("/", async function (req, res) {
  let {account, email, phone, name, role,state,pwd} = req.body;
  await client.post("/wlm", { phone, name,account,email,role,state,pwd });
  res.send({
    stats: 1
  })
})

router.post('/login', async function (req, res) {
    let { account, pwd } = req.body;
    let data = await client.get("/wlm", { account, pwd ,findType:"exact"});
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


module.exports = router;

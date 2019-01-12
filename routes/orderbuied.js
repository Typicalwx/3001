var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");







router.get("/:id", async function (req, res) {
    let id = req.params.id;
    
    console.log(id)
    let data = await client.get("/orderbuied/" + id)
    console.log(data)
    res.send(data);

});


module.exports = router;
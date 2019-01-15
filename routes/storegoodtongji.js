

var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

//查找折线图数组的servename
router.get("/", async function (req, res) {
    let { storeId, year } = req.query;
    console.log("111111",storeId)
    let data = await client.get("/storegoods", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    console.log("????",data);
    let servename = [];
    for (let i = 0; i < data.length; i++) {
        servename.push(data[i].name)
    }
    //查找折线图中的series,
    let data2 = await client.get("/orderbuy", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    let series = [];
    for (let j = 0; j < servename.length; j++) {
        // console.log(servename[j])
        let obj = {};
        let jidu = [];
        obj.name = servename[j];
        obj.type = "line";
        // obj.stack = "总量"
      
        for (let month = 1; month <= 12; month++) {
                let num =0 ;
            for (let i = 0; i < data2.length; i++) {
                if (data2[i].buytime.split(" ")[0].split("-")[0] == year &&
                    data2[i].buytime.split(" ")[0].split("-")[1] == month) {
                    for (let ij = 0; ij < data2[i].ordergoodarr.length; ij++) {
                        if (servename[j] == data2[i].ordergoodarr[ij].shangpingname) {
                            num +=data2[i].ordergoodarr[ij].num
                        }
                    }
                }
            }
            jidu.push(num)
        }
        obj.data =jidu
        series.push(obj)
    }





    // console.log(series)
    res.send([servename, series]);
})



//环状图 统计年
//查找折线图数组的servename
router.get("/years", async function (req, res) {
    let { storeId, year } = req.query;
    let dataname = await client.get("/storegoods", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })

    let data2num = await client.get("/orderbuy", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })


    let dataarr = [];
    for (let i = 0; i < dataname.length; i++) {
        let obj = {}
        obj.name = dataname[i].name;
        let value = 0;
        for (let j = 0; j < data2num.length; j++) {
            if (data2num[j].buytime.split(" ")[0].split("-")[0] == year) {
                for (let ij = 0; ij < data2num[j].ordergoodarr.length; ij++) {
                    if (dataname[i].name == data2num[j].ordergoodarr[ij].shangpingname) {
                        // console.log(data2num[j].ordergoodarr[ij].num)
                        value += data2num[j].ordergoodarr[ij].num
                    }
                }

            }
        }
        obj.value = value
        dataarr.push(obj)
    }
    res.send(dataarr);
})



//柱状图
router.get("/jidu", async function (req, res) {
    let { storeId, year } = req.query;
    let data = await client.get("/storegoods", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    let servename = [];
    for (let i = 0; i < data.length; i++) {
        servename.push(data[i].name)
    }

    //查找折线图中的series,
    let data2 = await client.get("/orderbuy", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    let series = [];
    for (let j = 0; j < servename.length; j++) {
        // console.log(servename[j])
        let obj = {};
        let jidu = [];
        obj.name = servename[j];
        obj.type = "bar";
        // obj.stack = "总量"
        obj.label = {
            normal: {
                show: true,
                position: 'insideRight'
            }
        };
        for (let month = 1; month <= 12; month++) {
                let num =0 ;
            for (let i = 0; i < data2.length; i++) {
                if (data2[i].buytime.split(" ")[0].split("-")[0] == year &&
                    data2[i].buytime.split(" ")[0].split("-")[1] == month) {
                    for (let ij = 0; ij < data2[i].ordergoodarr.length; ij++) {
                        if (servename[j] == data2[i].ordergoodarr[ij].shangpingname) {
                            num +=data2[i].ordergoodarr[ij].num
                        }
                    }
                }
            }
            jidu.push(num)
        }
        obj.data = [jidu[0] + jidu[1] + jidu[2], jidu[3] + jidu[4] + jidu[5],
        jidu[6] + jidu[7] + jidu[8], jidu[9] + jidu[10] + jidu[11]]
        series.push(obj)
    }

    console.log(series)
    res.send(series);
})

module.exports = router;


var express = require('express');
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");

//查找折线图数组的servename
router.get("/", async function (req, res) {
    let { storeId, year } = req.query;
    let data = await client.get("/serve", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    let servename = [];
    for (let i = 0; i < data.length; i++) {
        servename.push(data[i].severname)
    }

    //查找折线图中的series,
    let data2 = await client.get("/orderbuy", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })
    let series = [];
    for (let i = 0; i < data2.length; i++) {
        //已经判断了年
        if (data2[i].buytime.split(" ")[0].split("-")[0] == year) {
            //分辨月
            for (let j = 0; j < servename.length; j++) {
                for (let ij = 0; ij < data2[i].orderservearr.length; ij++) {
                    if (servename[j] == data2[i].orderservearr[ij].shangpingname) {
                        let obj = {};
                        obj.name = servename[j];
                        obj.type = "line";
                        // obj.stack = "总量"
                        obj.data = [];
                        for (let month = 1; month <= 12; month++) {
                            if (data2[i].buytime.split(" ")[0].split("-")[1] == month) {
                                obj.data.push(data2[i].orderservearr[ij].num)
                            } else {
                                obj.data.push(0)
                            }
                        }
                        series.push(obj)
                    }
                }
            }

        }
    }

    // console.log(series)
    res.send([servename,series]);
})



//环状图 统计年
//查找折线图数组的servename
router.get("/years",async function(req,res){
    let { storeId, year } = req.query;
    let dataname = await client.get("/serve", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })

    let data2num = await client.get("/orderbuy", {
        "stores.$id": storeId,
        submitType: "findJoin", ref: "stores"
    })


    let dataarr=[];
    for (let i = 0; i < dataname.length; i++) {
         let obj={}
         obj.name=dataname[i].severname;
         let value=0;
         for(let j=0;j<data2num.length;j++){
            if (data2num[j].buytime.split(" ")[0].split("-")[0] == year) {
                    for(let ij=0;ij<data2num[j].orderservearr.length;ij++){
                        if(dataname[i].severname==data2num[j].orderservearr[ij].shangpingname){
                            console.log(data2num[j].orderservearr[ij].num)
                            value += data2num[j].orderservearr[ij].num              
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
router.get("/jidu",async function(req,res){
    
})

module.exports = router;
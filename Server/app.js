const myexpress = require("express");
const path = require("path");
const morgan = require('morgan');
const app = myexpress();
const  XCYRouter = myexpress.Router();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(morgan('dev'));
app.use(myexpress.static(path.join(__dirname, "public")));
app.use(XCYRouter)

let completeArr =[]// 创建已完成树节点数组
let treeData = [
    {
        title: 'Todo',
        key: '0-0',
        children: [
            {
                title: '二级',
                key: '0-0-0',
                children: [
                    {
                        title: '三级',
                        key: '0-0-0-0',
                    },
                    {
                        title: '三级',
                        key: '0-0-0-1',
                    },
                ],
            },
            {
                title: '二级',
                key: '0-0-1',
                children: [
                    {
                        title: '三级',
                        key: '0-0-1-0',
                        children: [
                            {
                                title: '四级',
                                key: '0-0-1-0-0',
                            },
                            {
                                title: '四级',
                                key: '0-0-1-0-1',
                                children: [
                                    {
                                        title: '五级',
                                        key: '0-0-1-0-1-0',
                                    },
                                ]
                            },
                        ]
                    },
                ],
            },
        ],
    },
];// 树控组件后台数据
// 添加树节点方法
function addTreedom(value) {
    function filterkey(item1=[]) {
        item1.some((item2) => {
            if (item2.key ==value){
                if (item2.children) {
                    item2.children.push({
                        title: '默认标题',
                        key: value+"-"+item2.children.length,
                    })
                    return true
                }else {
                    item2.children =[{
                        title: '默认标题',
                        key: value+"-0",
                    }]
                    return true
                }
            }else if (item2.children){
                filterkey(item2.children)
            }
        })
    }

    treeData.some((item) => {
        if (item.key ==value){
            if (item.children) {
                item.children.push({
                    title: '默认标题',
                    key: value+"-"+item.children.length,
                })
                return true
            }else {
                item.children =[{
                    title: '默认标题',
                    key: value+"-0",
                }]
                return true
            }
        }else if (item.children){
            filterkey(item.children)
        }
    })

}
// 修改树节点的标题方法
function updatetitle(keys,titles) {
    function filterkey(item1=[]) {
        item1.some((item2) => {
            if (item2.key ==keys && item2.key){
                item2.title = titles
                return true
            }else if (item2.children){
                filterkey(item2.children)
            }
        })
    }

    treeData.some((item) => {
        if (item.key ==keys && item.key){
            item.title = titles
            return true
        }else if (item.children){
            filterkey(item.children)
        }
    })

}
// 获取已完成任务的父节点的key值
function findnewArr(arr){
    let newarr =[]
    let str =arr[0]
    arr.forEach((item)=>{
        if (item.length <str.length){
            str =item
        }
    })
    arr.forEach((item)=>{
        if (item.length ==str.length){
            newarr.push(item)
        }
    })

    newarr.forEach((item)=>{
        filterkeys(item)
    })
}
// 通过updatetitle方法获得的key值，去获得已完成树节点的数组
function filterkeys(str){
    treeData.some((item) => {
        if (item.key ==str){
            completeArr.push(item)
            return true
        }else if (item.children){
            filterkey(item.children)
        }
    })
    function filterkey(item1=[]) {
        item1.some((item2) => {
            if (item2.key ==str){
                completeArr.push(item2)
                return true
            }else if (item2.children){
                filterkey(item2.children)
            }
        })
    }
}
// 给前台返回所有数控组件数据的接口
XCYRouter.get('/getdata',function (req,res) {
    res.send({code:200,treeData})
})
// 获得已完成树节点的key值数组，并返回新树节点数据的接口
XCYRouter.get('/completetree',function (req,res) {
    completeArr =[]
    findnewArr(req.query.completeArr.split(','))
    res.send({code:200,completeArr})
})
// 给树节点添加children的接口
XCYRouter.get('/addTreedom',function (req,res) {
    addTreedom(req.query.key)
    res.send({code:200})
})
// 修改树节点标题的接口
XCYRouter.get('/updateTreedom',function (req,res) {
    let {key,title} =req.query
    updatetitle(key,title)
    res.send({code:200})
})

app.listen(9999, function () {  // 监听，服务器端口为9999
    console.log("服务已启动");
})


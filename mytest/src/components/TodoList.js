import React, {useState, useEffect} from 'react';
import Axios from "axios";
import "./TodoList.css"
import Complete from "./Complete";
import {Tree, Card, Input,Modal,Form,Button} from 'antd';
import {FormOutlined, PlusOutlined} from '@ant-design/icons'

function TodoList(props) {
    const [treeData, settreeData] = useState(null)// 树节点的数据
    const [isModalVisible, setIsModalVisible] = useState(false);// 模态框状态
    const [treeDomkey,settreeDomkey] =useState(null)// 选中前树节点的key值
    const [completeArr,setcompleteArr] =useState([])// 已完成树节点的数据
    const [form] = Form.useForm();// 获取表单方法

    // 初始化获取后台数据
    useEffect(() => {
        gettreeData()
    }, [])

    // 获取后台所有树节点的方法
    const gettreeData = () => {
        Axios.get('http://localhost:9999/getdata').then((res) => {
            if (res.data.code === 200) {
                addicon(res.data.treeData)
                settreeData(res.data.treeData)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 添加图标、添加点击事件的方法
    const addicon = (data) => {
        function addicons(item1) {
            item1.children.forEach((item2) => {
                if (item2 instanceof Object) {
                    item2.icon = <div className="icons-list">
                        <FormOutlined onClick={() => showModal(item2.key,item2.title)}/>
                        <PlusOutlined onClick={() => addTreedom(item2.key)}/>
                    </div>
                }
                if (item2.children) {
                    addicons(item2)
                }
            })
        }

        data.forEach((item) => {
            if (item instanceof Object) {
                item.icon = <div className="icons-list">
                    <FormOutlined onClick={() => showModal(item.key,item.title)}/>
                    <PlusOutlined onClick={() => addTreedom(item.key)}/>
                </div>
            }
            if (item.children) {
                addicons(item)
            }
        })

    }

    // 添加树节点的方法
    const addTreedom = (key) => {
        Axios.get('http://localhost:9999/addTreedom?key='+key).then((res) => {
            if (res.data.code === 200) {
                gettreeData()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 通过编辑按钮，显示模态框
    const showModal = (key,title) => {
        form.setFieldsValue({title})
        settreeDomkey(key)
        setIsModalVisible(true);
    };

    // 更新树节点标题的方法
    const onFinish = (value) => {
        Axios.get('http://localhost:9999/updateTreedom?key='+treeDomkey+'&title='+value.title).then((res) => {
            if (res.data.code === 200) {
                gettreeData()
            }
        }).catch((err) => {
            console.log(err)
        })
        setIsModalVisible(false);
        form.resetFields()
    };

    // 取消标题修改
    const onFinishFailed = (values) => {
        setIsModalVisible(false)
        form.resetFields()
    };

    // 获取后台已经完成的树节点的方法
    const onCheck = (checkedKeys) => {
        Axios.get('http://localhost:9999/completetree?completeArr='+checkedKeys).then((res) => {
            if (res.data.code === 200) {
                setcompleteArr(res.data.completeArr)
            }
        }).catch((err) => {
            console.log(err)
        })
    };

    return (
        <>
            <Card style={{width: 500}} title="Multi-level Todo List">
                <Tree
                    checkable
                    showIcon
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Card>
            <Modal
                title="修改标题"
                visible={isModalVisible}
                Button={false}
                closable={false}
                footer={null}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        name="title"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                    >
                        <Button type="primary" htmlType="submit">
                            确认
                        </Button>
                        <Button onClick={onFinishFailed} style={{marginLeft:20}}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/*子组件*/}
            <Complete completeArr={completeArr}></Complete>
        </>
    );
}

export default TodoList;
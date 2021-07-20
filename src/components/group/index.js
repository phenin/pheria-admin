import React, { useState, useEffect } from 'react'
import 'css/home.scss'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { getListGroup, setGroup, deleteGroup } from 'store/actions/groupActions'
import { Table, Space, Row, Col, Button } from 'antd';
import Modal from "./modal";

export default function Group() {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const state = useSelector(stateSelector, shallowEqual)
  const [query, setQuery] = useState({limit: 5, page: 1})
  const [visible, setVisible] = useState(false)
  const [check, setCheck] = useState(false);
  const [showEdit, setShowEdit] = useState(false)
  const [temp, setTemp] = useState({})
 


 
  useEffect(()=>{
    dispatch(getListGroup(query))
  },[query, dispatch, getListGroup, check])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a href onClick={()=>editGroup(record)}>Edit</a>
          <a href onClick={()=>handleDelete(record)}>Delete</a>
        </Space>
        
      ),
    },
  ];
  const handleDelete = async(record) => {
    let temp= {
      "_id":record._id
    }
     await dispatch(deleteGroup(temp))
     setCheck(!check);
    //  console.log(check);
  }


  const editGroup = (record) => {
    dispatch(setGroup(record))
    setVisible(true)
  }

  const createGroup = () => {
    dispatch(setGroup(null))
    setVisible(true)
  }

  const closeModal = () =>{
    setVisible(false)
    dispatch(getListGroup(query))
  }

  return (
    <div >
      <Row justify='round' className="group_header">
        <Col span={20} className="group_header-name">
          <h3>Group</h3>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={()=>createGroup()}>Add Group</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={state.listGroup} 
        pagination={{ total: state.total,
          showTotal: total => `Total ${total} Group`,
          onChange: ((page, pageSize) => {
            setQuery({
              page: page,
              limit: pageSize
            }, () => {
                this.changeQuery()
            })
          }),
          defaultPageSize: 5, 
          showSizeChanger: true, 
          pageSizeOptions: ['5', '10', '20', '30']
        }}
      />
      {visible && 
        <Modal 
          centered 
          visible={visible} 
          closeModal={closeModal}
        />
      }
      
    </div>
  )
}

function stateSelector(state) {
  return {
    listGroup: state.group.listGroup,
    total: state.group.total
  }
}


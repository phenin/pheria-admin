import React, { useState, useEffect } from 'react'
import 'css/home.scss'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { getListTemplate, setTemplate } from 'store/actions/groupActions'
import { Table, Space, Row, Col, Button } from 'antd';
// import Modal from "./modal"

export default function Censorship() {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  // const history = useHistory()
  const state = useSelector(stateSelector, shallowEqual)
  const [query, setQuery] = useState({limit: 5, page: 1})
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    dispatch(getListTemplate(query))
  },[query, dispatch, getListTemplate])

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
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        
          <a href onClick={()=>editTemplate(record)}>Edit</a>
          
        
      ),
    },
  ];

  const editTemplate = (record) => {
    dispatch(setTemplate(record))
    setVisible(true)
  }

  const createTemplate = () => {
    dispatch(setTemplate(null))
    setVisible(true)
  }

  const closeModal = () =>{
    setVisible(false)
    dispatch(getListTemplate(query))
  }

  return (
    <div >
      <Row justify='round' className="censorship_header">
        <Col span={20} className="censorship_header-name">
          <h3>Censorship</h3>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={()=>createTemplate()}>Add Template</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={state.listTemplate} 
        pagination={{ total: state.total,
          showTotal: total => `Total ${total} Template`,
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
      {/* {visible && 
        <Modal 
          centered 
          visible={visible} 
          closeModal={closeModal}
        />
      } */}
    </div>
  )
}

function stateSelector(state) {
  return {
    listTemplate: state.template.listTemplate,
    total: state.template.total
  }
}


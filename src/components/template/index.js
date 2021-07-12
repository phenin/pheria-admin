import React, { useState, useEffect } from 'react'
import 'css/home.scss'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { getListTemplate } from 'store/actions/templateActions'
import { Table, Space } from 'antd';

export default function Template() {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  // const history = useHistory()
  const state = useSelector(stateSelector, shallowEqual)
  const [query, setQuery] = useState({limit: 10, page: 1})

  console.log(state.listTemplate)

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
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <p>Edit</p>
          <p>Delete</p>
        </Space>
      ),
    },
  ];

  return (
    <div >
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
    </div>
  )
}

function stateSelector(state) {
  return {
    listTemplate: state.template.listTemplate,
    total: state.template.total
  }
}


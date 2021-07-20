import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Input, Button, Form, Select, message } from "antd"
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import UploadImage from "components/common/uploadSingleImage"
import { LoadingOutlined } from '@ant-design/icons';
import { createUpdateGroup } from "store/actions/groupActions"
const {Option} = Select

export default function ModalTemplate({visible, closeModal}) {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const state = useSelector(stateSelector, shallowEqual)

  const [form] = Form.useForm();
  //???
 
  const [image, setImage] = useState([])

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const onFinish = async (value) =>{
    const _id = state.template && state.template._id
    const data = {
      _id,
      ...value,
      image
    }
    //console.log(data)
  

    const success = await dispatch(createUpdateGroup(data))
    
    if(success) {
      message.success(`${_id ?'Cập nhật Group thành công' :'Thêm mới Group thành công'}`);
    }
    else{
      message.success(`${_id ?'Cập nhật Group thất bại' :'Thêm mới Group thất bại'}`);
    }
    closeModal()
  }

  const upload = (imageUrl) =>{
        setImage(imageUrl);
        console.log(imageUrl)
        console.log("state",state)
      
    
    
    // console.log(list)
  }

  return (
    <Modal 
      title={`${state.group && state.group._id ?'Cập nhật Group' :'Thêm mới Group'}`}
      visible={visible} 
      onCancel={()=>closeModal(false)}
      footer={null}
    >
      <Form
        {...formItemLayout}
        layout={'horizontal'}
        form={form}
        onFinish={onFinish}
        initialValues={state.group}
      >
        <Form.Item 
          label="Tên group" 
          name="name"
          rules={[
            {
              required: true,
              message: 'Tên Group là bắt buộc',
            },
          ]}>
          <Input placeholder="Tên group" />
        </Form.Item>

        <Form.Item 
          label="Miêu tả" 
          name="description"
          rules={[
            {
              required: true,
              message: 'Miêu tả là bắt buộc',
            },
          ]}>
          <Input placeholder="Miêu Tả" />
          
        </Form.Item>

        

        

       

        <UploadImage file={state.group&&state.group.image}  upload={upload}
              isCreate={state.group && state.group._id ?false :true}        />

        <Form.Item >
          {
            state.loading ? <LoadingOutlined /> : 
            <Button type="primary" htmlType="submit">
              {`${state.group && state.group._id ?'Cập nhật Group' :'Tạo mới Group'}`}</Button>
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}
function stateSelector(state) {
  return {
    group: state.group.group,
    loading: state.group.loading,
    // state:state
  }
}
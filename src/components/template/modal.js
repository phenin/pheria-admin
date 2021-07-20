import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Input, Button, Form, Select, message } from "antd"
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import UploadImage from "components/common/uploadImage"
import { LoadingOutlined } from '@ant-design/icons';
import { createUpdateTemplate } from "store/actions/templateActions"

const {Option} = Select

export default function ModalTemplate({visible, closeModal}) {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const state = useSelector(stateSelector, shallowEqual)

  const [form] = Form.useForm();

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
    const success = await dispatch(createUpdateTemplate(data))
    if(success) {
      message.success(`${_id ?'Cập nhật Template thành công' :'Thêm mới Template thành công'}`);
    }
    else{
      message.success(`${_id ?'Cập nhật Template thất bại' :'Thêm mới Template thất bại'}`);
    }
    closeModal()
  }

  const upload = (listimage) =>{
    console.log(state)
    const list = listimage.map(item => {
      return {
        uid: item.uid,
        status: item.status,
        url: item.response && item.response.url,
        name: item.name
      }
    })
    setImage(list)
  }

  return (
    <Modal 
      title={`${state.template && state.template._id ?'Cập nhật Template' :'Thêm mới Template'}`}
      visible={visible} 
      onCancel={()=>closeModal(false)}
      footer={null}
    >
      <Form
        {...formItemLayout}
        layout={'horizontal'}
        form={form}
        onFinish={onFinish}
        initialValues={state.template}
      >
        <Form.Item 
          label="Tên template" 
          name="name"
          rules={[
            {
              required: true,
              message: 'Tên template là bắt buộc',
            },
          ]}>
          <Input placeholder="Tên template" />
        </Form.Item>

        <Form.Item 
          label="Nhóm template" 
          name="group"
          rules={[
            {
              required: true,
              message: 'Nhóm template là bắt buộc',
            },
          ]}>
          <Select placeholder="select your gender">
            <Option value="depression">Depression</Option>
            <Option value="happy">Happy</Option>
            <Option value="love">Love</Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label="Loại template" 
          name="type"
          rules={[
            {
              required: true,
              message: 'Loại template là bắt buộc',
            },
          ]}>
          <Input placeholder="Loại template" />
        </Form.Item>

        <Form.Item 
          label="Màu nền template" 
          name="backgroundColor"
          rules={[
            {
              required: true,
              message: 'Màu nền template là bắt buộc',
            },
          ]}>
          <Input placeholder="Màu nền template" />
        </Form.Item>

        <Form.Item 
          name="color"
          label="Màu chữ template" 
        >
          <Input placeholder="Màu chữ template" />
        </Form.Item>

        <UploadImage fileList={state.template && state.template.image} upload={upload}/>

        <Form.Item >
          {
            state.loading ? <LoadingOutlined /> : 
            <Button type="primary" htmlType="submit">
              {`${state.template&&state.template._id ?'Cập nhật Template' :'Tạo mới Template'}`}</Button>
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}
function stateSelector(state) {
  return {
    template: state.template.template,
    loading: state.template.loading
  }
}
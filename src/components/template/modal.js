import React from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Input, Button, Form, Select } from "antd"
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom"
import UploadImage from "components/common/uploadImage"

const {Option} = Select

export default function ModalTemplate({visible, closeModal}) {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const history = useHistory()
  const state = useSelector(stateSelector, shallowEqual)

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const onFinish = (value) =>{
    console.log(value)
  }

  return (
    <Modal 
      title="Create Template" 
      visible={visible} 
      onCancel={()=>closeModal(false)}
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

        <UploadImage />

        <Form.Item >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
function stateSelector(state) {
  return {
    template: state.template.template,
  }
}
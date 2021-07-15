import React, {  useState } from 'react'
import { Input,Modal,Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AliyunOSSUpload from './uploadimages'
import { createUpdateGroup } from 'store/actions/groupActions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';


export default function ModalForm(props){
    const dispatch = useDispatch()
    const state = useSelector((state)=>state, shallowEqual )

    const [loading, setLoading] = useState(false);
   
      const handleOk = async() =>{
        setLoading(true);
        let temp = {
            "name":"noneName",
            "description":"default",
            "image":"./"
        }
        let selectorName = document.querySelector('.name-input')
        let selectorDescription = document.querySelector('.description-input')
        // console.log(selectorDescription.children[1].value)
        temp={...temp,
            "name":selectorName.children[1].value,
            "description":selectorDescription.children[1].value
        }  
            await  dispatch(createUpdateGroup(temp))
            setLoading(false);
            props.closeModal();

      }

    return (
        <div>
           <Modal
          visible={props.visible}
          title="Create Group"
          onOk={handleOk}
          onCancel={props.closeModal}
          footer={[
            <Button key="back" onClick={props.closeModal} >
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              Submit
            </Button>
          ]}
        >
            <Input className="name-input" size="default" placeholder="Name" prefix={<UserOutlined />}></Input>
            <Input size="default" className="description-input" placeholder="Description" prefix={<UserOutlined />}></Input>
            <AliyunOSSUpload></AliyunOSSUpload>
        </Modal>

        </div>
    )
}
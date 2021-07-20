import React from 'react'
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class UploadImage extends React.Component {
  state = {
    loading: false,
    firstTime:true,
    check: true
  };

  handleChange = info => {
    // console.log("hi")
    
    if (info.file.status === 'uploading') {
      this.setState({ loading: true,
        check: false });
      return;
    }
    if (info.file.status === 'done') {
      if(!this.props.file){

        this.props.upload(info.file.response &&  info.file.response.url)
      }else{
        this.props.upload(this.props.file)
      }
      console.log("infor",info)

      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
          loading: false,
        })
        
      });
      
    }
  };

  render() {
    const { loading, imageUrl, firstTime,check } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const onLoading = ()=>{
      
     if(!this.props.isCreate&& this.state.firstTime){
        this.setState({
          imageUrl:this.props.file,
          firstTime:false
        })
        console.log("imageURL", this.state.imageUrl)}
        console.log("first time ", this.props.isCreate)
    }
    // const findThumb = () => {
    //   if(imageUrl)
    //     return imageUrl;
    //     return ""
    // }
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        // showUploadList={true}
        action="http://localhost:8001/api/upload-image"
        maxCount={1}
        // thumbUrl={findThumb()}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        onPreview={onLoading()}
      >
        {imageUrl ?check? <img src={imageUrl} alt="avatar" style={{  height:'100%' }} /> : uploadButton: uploadButton}
      </Upload>
    );
  }
}

export default UploadImage
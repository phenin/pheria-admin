import React, { useState } from 'react'
import { Menu } from 'antd';
import {
  WarningOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { useHistory } from "react-router-dom";

// const { SubMenu } = Menu;

export default function MenuMobile({collapsed}) {
  const history = useHistory();

  const [active, setActive] = useState('template')

  const redirect = (name) =>{
    setActive(name)
    history.push(`/${name}`);
  }

  return (
    <div className="menu">
      <Menu
          defaultSelectedKeys={[active]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
        >
          <Menu.Item key="template" onClick={()=>redirect('template')} icon={<DesktopOutlined />}>
            Template
          </Menu.Item>
          <Menu.Item key="censorship" onClick={()=>redirect('censorship')} icon={<WarningOutlined />}>
            Censorship
          </Menu.Item>
          {/* <Menu.Item key="3" icon={<ContainerOutlined />}>
            Option 3
          </Menu.Item>
          <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu> */}
        </Menu>
    </div>
    
  )
}
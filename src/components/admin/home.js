import React from 'react'
import Menu from 'components/menu'
import 'css/home.scss'
import { Layout } from 'antd';
import AppRouter from 'components/admin/router'

const { Header, Content, Sider } = Layout;

export default function Home() {

  return (
    <div className="background">
      <Layout style={{ height: '100vh' }}>
        <Header className="header"></Header>
        <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu collapsed={true}/>
        </Sider>
          <Layout style={{ padding: '0 24px' }}>
            <Content className="site-layout-background">
              <AppRouter />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
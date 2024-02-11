import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Flex, Layout, Menu } from 'antd';
import React, { useContext } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import { CustomRoutes } from './Routes';
import { FitbitAuthContext, FitbitLoginContext } from './contexts/fitbitAuthContext';
import { FitbitAuthModel } from './models/fitbitAuthModel';

const { Header, Content, Sider } = Layout;

interface MenuItem {
  label: string;
  key: string;
  icon: JSX.Element;
}

const items: MenuItem[] = [
  {
    label: 'Beer server',
    key: '/beer',
    icon: <CoffeeOutlined />,
  },
  {
    label: 'Goal setting',
    key: '/goal',
    icon: <FireOutlined />,
  },
  {
    label: 'Login page',
    key: '/auth',
    icon: <UserOutlined />,
  },
  {
    label: 'Guest page',
    key: '/auth/guest',
    icon: <SmileOutlined />,
  },
];


const App: React.FC = () => {
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel, React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext); // eslint-disable-line
  const [fitbitLoginContext, setFitbitLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(FitbitLoginContext); // eslint-disable-line
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0" theme="light">
          <Menu mode="vertical" theme="light">
            {items.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {fitbitAuthContext.is_guest_login && <Flex justify="flex-end"><div style={{color: "white", marginRight: 30}}>ゲストモード</div></Flex>}
            {fitbitLoginContext && 
              <Flex justify="flex-end" vertical={false} align='center'>
                <div style={{color: "white", marginRight: 10}}>
                  {fitbitAuthContext.user_name}
                </div>
                <img src={fitbitAuthContext.avatar_url} alt='logo' style={{height: 50, marginRight: 10}}></img>
              </Flex>
            }
          </Header>
          <Content style={{ margin: '16px' }}>
            <div className="site-layout-content">
              <CustomRoutes/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;

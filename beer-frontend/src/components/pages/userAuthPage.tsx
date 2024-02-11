import React, { useState, useContext, useEffect } from 'react';
import { Card, Button, Steps, theme  } from 'antd';
import FitbitUserProfileBlock from '../blocks/fitbitUserProfileBlock';
import { FitbitLoginContext } from '../../contexts/fitbitAuthContext';
import { CognitoLoginContext } from '../../contexts/cognitoAuthContext';
import CognitoUserProfileBlock from '../blocks/cognitoUserProfileBlock';
import { useLocation, useNavigate } from "react-router-dom";

const steps = [
  {
    title: 'Fitbitへログイン',
    content: 
      <Card title="fitbitとの連携" bordered={false} style={{ width: '100%' }}>
        <FitbitUserProfileBlock />
      </Card>,
  },
  {
    title: 'Cognitoへログイン',
    content: 
      <Card title="cognitoとの連携" bordered={false} style={{ width: '100%' }}>
        <CognitoUserProfileBlock />
      </Card>,
  },
];

const UserAuthPage: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [fitbitLoginContext, setFitbitLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(FitbitLoginContext); // eslint-disable-line
  const [cognitoLoginContext, setCognitoLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(CognitoLoginContext); // eslint-disable-line
  let location = useLocation();
  let navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";

  const prev = () => {
    setCurrent(current - 1);
  };

  const change = (next: number) => {
    setCurrent(next);
  }

  useEffect(() => {
    if (!fitbitLoginContext){
      change(0);
    } else if (!cognitoLoginContext){
      change(1);
    } else {
      navigate(from, { replace: true });
    }
  }, [cognitoLoginContext, fitbitLoginContext, from, navigate]);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <Steps current={current} items={items}/>
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
      <Button style={{ margin: '0 8px' }} onClick={()=>navigate("/auth/guest")}>
        ゲストでログイン
      </Button>
    </>
  );
};

export default UserAuthPage;

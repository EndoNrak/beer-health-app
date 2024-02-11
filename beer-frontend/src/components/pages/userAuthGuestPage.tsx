import React, { useContext } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { FitbitAuthContext } from '../../contexts/fitbitAuthContext';
import { CognitoAuthContext } from '../../contexts/cognitoAuthContext';
import { useNavigate } from "react-router-dom";
import { CognitoAuthModel, CognitoAuthModelFactory } from '../../models/cognitoAuthModel';
import { FitbitAuthModel, FitbitAuthModelFactory } from '../../models/fitbitAuthModel';

const { Title, Paragraph } = Typography;


const UserAuthGuestPage: React.FC = () => {
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel, React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext);// eslint-disable-line
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext);// eslint-disable-line

  let navigate = useNavigate();
  const onFinish = (values: any) => {
    signinAsGuest(values["name"]);
  }
  const signinAsGuest = (name: string) => {
    setFitbitAuthInfo(FitbitAuthModelFactory.createGuest(name));
    setCognitoAuthInfo(CognitoAuthModelFactory.createGuest(name));
    navigate("/goal/guest");
  }

  return (
    <div style={{marginLeft: "5%"}}>
      <Title level={3}>ゲスト用体験ページ</Title>
      <Paragraph>アカウントを持っていない方にもユーザー体験可能なページを用意しました</Paragraph>
      <Paragraph>・AIインストラクターとのチャット</Paragraph>
      <Paragraph>・ビールサーバの起動</Paragraph>       
      <Paragraph>ユーザー名として設定する名前を入力してください</Paragraph>
      <Form
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="ゲストユーザー名"
          rules={[{ required: true, message: 'Please enter text!' }]}
        >
          <Input style={{maxWidth: 300}}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            ゲストとしてログイン
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserAuthGuestPage;

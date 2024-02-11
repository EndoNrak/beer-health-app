import React, { useEffect, useState} from 'react';
import { Button, Card, Col, Flex, Form, InputNumber, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const GoalManageGuestPage: React.FC = () => {
  const [achievementRate, setAchievementRate] = useState<number>(0);// eslint-disable-line
  const [form] = Form.useForm<{ target: number; current: number }>();
  const targetValue = Form.useWatch('target', form);
  const currentValue = Form.useWatch('current', form);
  const navigate = useNavigate();

  useEffect(() => {
    setAchievementRate((targetValue>0&&currentValue>0) ? Math.min(100, Number(currentValue/targetValue*100)) : 0);
  }, [targetValue, currentValue]);

  return (
    <div>
      <h1>目標の管理</h1>
      <Button type="primary" onClick={()=>navigate("/chat")} style={{ marginTop: '20px' }} >
        目標値設定のチャット
      </Button>
      <div>目標値と現状値を手動で入力してください</div>
      <Form form={form} layout="vertical" autoComplete="off">
        <Flex vertical={false}>
          <Form.Item name="target" label="目標値">
            <InputNumber />
          </Form.Item>
          <Form.Item name="current" label="現状値">
            <InputNumber />
          </Form.Item>
        </Flex>
      </Form>
      <Card title="本日の目標" bordered={false} style={{ width: '100%' }}>  
        <div>
          <Row justify="space-evenly">
            <Col span={6}>
              <Statistic title="現在" value={currentValue} suffix="歩" valueStyle={{fontSize: 14}}/>
            </Col>
            <Col span={6}>
              <Statistic title="目標" value={targetValue} suffix="歩" valueStyle={{fontSize: 14}}/>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={12}>
              <div>
                <p style={{color: "grey"}}>進捗率</p>
                <div style={{width: 120, height: 120, margin: "auto" }}>
                  <CircularProgressbar value={achievementRate} text={`${achievementRate.toFixed(1).toString()}%`} 
                  styles={buildStyles({
                    textSize: '16px',
                    pathTransitionDuration: 0.5,
                  })} />
                </div>
              </div>
            </Col>
          </Row>
          <Row justify="start">
            <Col span={8}>
              <Button onClick={
                () => navigate('/beer')
                }
                disabled = {achievementRate<100}
                style={{ marginTop: '20px' }}
              >報酬の受け取りへ</Button>
            </Col>
          </Row>      
        </div>
      </Card>
    </div>
  );
};

export default GoalManageGuestPage;

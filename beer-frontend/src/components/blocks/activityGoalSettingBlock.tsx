import React, {useState, useContext} from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { ActivityGoalModel } from '../../models/activityGoalModel';
import { CognitoAuthContext } from '../../contexts/cognitoAuthContext';
import { CognitoAuthModel } from '../../models/cognitoAuthModel';
import BeerRepository from '../../repositories/beerRepository';

const ActivityGoalForm: React.FC<{ initialGoal: ActivityGoalModel, onFinish: (values: ActivityGoalModel) => void }> = ({ initialGoal, onFinish }) => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext);// eslint-disable-line

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ActivityGoalModel) => {
    setLoading(true);
    if (cognitoAuthContext.access_token!=="guest"){
      const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
      await beerRepository.postNewGoal(cognitoAuthContext.user_id, values);
    }
    setTimeout(() => {}, 500);
    setLoading(false);
    onFinish(values);
  };

  return (
    <Form
      name="activityGoalForm"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        label="Category"
        name="category"
        initialValue="steps"
        rules={[{ required: true, message: 'Please enter the category!' }]}
      >
        <Radio.Group disabled>
          <Radio value="steps"> 歩数 </Radio>
          <Radio value="calories"> 消費カロリー </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="TargetValue"
        name="targetValue"
        initialValue={initialGoal.TargetValue}
        rules={[{ required: true, message: 'Please enter the value!' }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ActivityGoalForm;

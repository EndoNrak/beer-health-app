import React, { useEffect, useState, useContext } from 'react';
import { Button, Card } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

import { ActivityGoalModel } from '../../models/activityGoalModel';
import { CognitoAuthContext } from '../../contexts/cognitoAuthContext';
import { CognitoAuthModel } from '../../models/cognitoAuthModel';
import BeerRepository from '../../repositories/beerRepository';

import TodayActivityBlock from '../blocks/todayActivityBlock';
import { useNavigate } from 'react-router-dom';


const GoalManagePage: React.FC = () => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext);
  const [activityGoal, setActivityGoal] = useState<ActivityGoalModel | null | Error>(null);
  const todayDate: Date = new Date();
  const navigate = useNavigate();


  const handleUpdateData = async () => {
    setActivityGoal(null);
    const fetchData = async () => {
      const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
      const goal = await beerRepository.getLatestGoal(cognitoAuthContext.user_id); 
      if (goal instanceof Error){
        return;
      }
      setActivityGoal(goal);
    };
    fetchData();
  };

  useEffect(() => {
    const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
    beerRepository.getLatestGoal(cognitoAuthContext.user_id)
    .then(
      (data)=>{setActivityGoal(data)}
    );
    return () => {setActivityGoal(null)}
  }, [setCognitoAuthInfo, cognitoAuthContext]);

  if (activityGoal instanceof Error){
    return(
      <div>
        <p>エラーが発生しました</p>
        <p>再度ログインしてください</p>
        <Button type="primary" onClick={() => navigate("/auth")} style={{ marginTop: '20px' }} >
          認証ページへ
        </Button>
      </div>
    );
  }
  if (activityGoal){
    return (
      <div>
        <h1>目標の管理    
          <Button type="text" onClick={handleUpdateData} style={{ marginLeft: '20px' }} icon={<RedoOutlined/>}/>
        </h1>
        <Card title="本日の目標" extra={<p>{todayDate.toLocaleDateString()}</p>} bordered={false} style={{ maxWidth: 500 }}>
          <TodayActivityBlock activityGoal={activityGoal}/>
        </Card>
        <Button type="primary" onClick={()=>navigate("/chat")} style={{ marginTop: '20px' }} >
          目標値の更新
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>目標の管理
          <Button type="text" onClick={handleUpdateData} style={{ marginLeft: '20px' }} icon={<RedoOutlined/>}/>
        </h1>
        <p>目標設定がまだ行われていません</p>
        <p>下のボタンを押して目標を設定しましょう！</p>
        <Button type="primary" onClick={()=>navigate("/chat")} style={{ marginTop: '20px' }} >
          Add New Exercise Goal
        </Button>
      </div>
    );
  }
};

export default GoalManagePage;

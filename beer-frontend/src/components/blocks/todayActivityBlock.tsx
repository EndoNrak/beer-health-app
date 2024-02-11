import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useNavigate } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';

import FitbitRepository from '../../repositories/fitbitRepository';
import { FitbitAuthContext, FitbitLoginContext } from '../../contexts/fitbitAuthContext';
import { FitbitAuthModel } from '../../models/fitbitAuthModel';
import { ActivityGoalModel } from '../../models/activityGoalModel';
import { AreDatesEqual } from '../../utils/areDatesEqual';
import { Button, Col, Row, Statistic } from 'antd';
import { DaySteps } from '../../models/dayStepsModel';

// Update the props interface to include the activityGoal prop
interface TodayActivityBlockProps {
  activityGoal: ActivityGoalModel;
}

const TodayActivityBlock: React.FC<TodayActivityBlockProps> = ({ activityGoal }) => {
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel,  React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext); // eslint-disable-line
  const [fitbitLoginContext, setFitbitLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(FitbitLoginContext);
  const [data, setData] = useState<DaySteps | null>(null);
  const [achievementRate, setAchievementRate] = useState<number>(0);
  const goal: number = activityGoal.TargetValue;
  const goalDate: Date = activityGoal.GoalDate;
  const todayDate: Date = new Date();
  const navigate = useNavigate();

  useEffect(() => {
    if (!fitbitLoginContext){
      return;
    }
    const fitbitRepository: FitbitRepository = new FitbitRepository(fitbitAuthContext);
    fitbitRepository.getTodaySteps()
      .then((data) => {
        setData(data);
        setAchievementRate(data.steps/goal*100>100 ? 100 : data.steps/goal*100);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fitbitAuthContext, fitbitLoginContext, goal, setFitbitLoginContext]);

  if (data==null){
    return (
      <div style={{ width: 150, height: 150 }}>
      </div>
    );
  }

  if (!AreDatesEqual(goalDate, todayDate)){
    return(
      <div>
        <p>本日の目標設定をまだ行っていません</p>
        <div style={{ width: 150, height: 150 }}>
          <CircularProgressbar value={0} text={`-`}  
            styles={buildStyles({
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
              textSize: '16px',
              pathTransitionDuration: 0.5,
            })} />
        </div>
        <p>最新の目標</p>
        <p>date: {activityGoal.GoalDate.toLocaleDateString()} </p>
        <p>下のボタンより本日の目標設定を行ってください</p>
      </div>
    );
  }

  return (
    <div>
      <Row justify="space-evenly">
        <Col span={6}>
          <Statistic title="現在" value={data.steps} suffix="歩" valueStyle={{fontSize: 16}}/>
        </Col>
        <Col span={6}>
          <Statistic title="目標" value={goal} suffix="歩" valueStyle={{fontSize: 16}}/>
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
  );
}

export default TodayActivityBlock;

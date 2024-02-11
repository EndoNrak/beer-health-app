import React, { useContext, useEffect, useState } from 'react';
import { useMedia } from 'use-media';
import BeerRepository from '../../repositories/beerRepository';
import { CognitoAuthContext } from '../../contexts/cognitoAuthContext';
import { CognitoAuthModel } from '../../models/cognitoAuthModel';
import { DeviceModel } from '../../models/deviceModel';
import { message, Flex, Button, Spin } from 'antd';
import { DeviceCard } from '../blocks/deviceCard';

const BeerServerPage = () => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext); // eslint-disable-line
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const isWide = useMedia('(min-width: 780px)');
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleStartButton = async () => {
    setLoading(true);
    
    await new Promise(s => setTimeout(s, 1000)); // to be removed
    const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
    beerRepository.startBeerServer(devices[selected ? selected : 0].id)
    .then((response) => {
      if( response instanceof Error){
        throw response;
      } else {
        messageApi.open({
          type: 'success',
          content: response,
        });
      }
    }
    )
    setLoading(false);
  };

  const handleStopButton = async () => {
    setLoading(true);
    
    await new Promise(s => setTimeout(s, 1000)); // to be removed
    const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
    beerRepository.stopBeerServer(devices[selected ? selected : 0].id)
    .then((response) => {
      if( response instanceof Error){
        throw response;
      } else {
        messageApi.open({
          type: 'success',
          content: response,
        });
      }
    }
    )
    setLoading(false);
  };

  const onSelected = (index: number) => {
    setSelected(index);
  }

  useEffect(() => {
    const beerRepository: BeerRepository = new BeerRepository(cognitoAuthContext);
    beerRepository.getDevicesByUserId(cognitoAuthContext.user_id)
    .then(
      (data)=>{
        if (data instanceof Error){
          messageApi.open({
            type: 'warning',
            content: '登録デバイスの取得時にエラーが発生しましたエラーが発生しました',
          });
        } else {
          setDevices(data);
        }
      }
    );
  }, [devices, cognitoAuthContext, messageApi]);

  return (
    <div>
      {contextHolder}
      <h2>登録済みのデバイス</h2>
      <div>デバイスを選択して起動ボタンを押してください</div>
      <Flex vertical={!isWide} justify='flex-start'>
        {devices.map((device, index)=>
        <div key={index} style={{margin: 10}} onClick={() => onSelected(index)}>
          <DeviceCard device={device} selected={index===selected}/>
        </div>)}
      </Flex>
      <Button type="primary" onClick={handleStartButton} loading={loading}> 起動 </Button>
      <Button type="primary" onClick={handleStopButton} loading={loading}> 停止 </Button>
      <Spin spinning={loading} fullscreen/>
    </div>
  );
}

export default BeerServerPage;

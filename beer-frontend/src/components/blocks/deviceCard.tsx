import React from 'react';
import { Card } from 'antd';
import { DeviceModel } from '../../models/deviceModel';
import useMedia from 'use-media';

const { Meta } = Card;

export const DeviceCard: React.FC<{device: DeviceModel, selected: boolean}> = ({device, selected}) => {
  const isMobile = useMedia('(min-width: 780px)');
  const cardStyle = {
    margin: 'auto',
    backgroundColor: selected ? "papayawhip": "",
    width: isMobile ? '70%' : '350px',
  };
  
  return (
    <Card title={device.name} hoverable style={cardStyle} cover={<img alt={device.name} src={device.image_src} />}>
      <Meta title="デバイスID" description={device.id}/>
    </Card>
  );
}
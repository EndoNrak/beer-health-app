import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { AssistantModel } from '../../models/assistantModel';
import { LazyLoadImage, ScrollPosition, trackWindowScroll } from 'react-lazy-load-image-component';

import { useState } from 'react';

const AssistantCard: React.FC<{assistant: AssistantModel, selected: boolean, scrollPosition: ScrollPosition}> = ({assistant, selected, scrollPosition}) => {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div style={{
      backgroundColor: selected ? "papayawhip": '#dcdcdc',
      border: selected ? '2px solid red' : '2px solid transparent', // 選択時に外枠線を赤くする
      height: 250,
      width: "100%",
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative', // 要素の位置を設定
    }}>
      <LazyLoadImage
        src={assistant.image_src} 
        alt={assistant.name}
        effect="opacity"
        width='100%' // 幅を100%に設定
        height='100%'
        scrollPosition={scrollPosition}
        style={{
          objectFit: 'cover', // 画像を親要素にカバーさせる
        }} 
      />
      <div 
        onClick={toggleDescription} // クリックイベントを追加
        style={{
          position: 'absolute', // 絶対位置指定
          top: 0, // 上端に配置
          right: 0, // 右端に配置
          color: '#fff', // 文字の色を設定
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // 背景色を設定
          width: 20, // 幅を20pxに設定
          height: 20,
          display: 'flex',
          justifyContent: 'center', // 水平方向に中央揃え
          alignItems: 'center', // 垂直方向に中央揃え
        }}>
        <InfoCircleOutlined/>
      </div>
      {showDescription && (
        <div style={{
          position: 'absolute', // 絶対位置指定
          top: "10%", // 下部に配置
          left: 0, // 左端に配置
          color: '#fff', // 文字の色を設定
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // 背景色を設定
          width: '100%', // 幅を100%に設定
          height: '90%',
        }}>
          {assistant.description}
        </div>
      )}
      <div style={{
        position: 'absolute', // 絶対位置指定
        bottom: 0, // 下部に配置
        left: 0, // 左端に配置
        padding: 5, // 適切なパディングを追加
        color: '#fff', // 文字の色を設定
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // 背景色を設定
        width: '100%', // 幅を100%に設定
        boxSizing: 'border-box', // ボックスサイジングをborder-boxに設定
      }}>
        {assistant.name}
      </div>
    </div>
  );
};


export default trackWindowScroll(AssistantCard);
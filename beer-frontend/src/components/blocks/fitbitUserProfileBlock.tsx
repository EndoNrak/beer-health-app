import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'antd'; 

import FitbitRepository from '../../repositories/fitbitRepository';
import { User } from  '../../models/userModel';
import { FitbitAuthContext, FitbitLoginContext } from '../../contexts/fitbitAuthContext';
import { FitbitAuthModel, FitbitAuthModelFactory } from '../../models/fitbitAuthModel';

const FitbitUserProfileBlock = () => {
  
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel,  React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext);
  const [fitbitLoginContext, setFitbitLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(FitbitLoginContext);
  const [user, setUser] = useState<User | null | Error>(null);
  const handleAuthClick = () => {
    const auth = FitbitAuthModelFactory.create();
    setFitbitAuthInfo(auth);
    window.location.href = auth.generate_auth_url;
  };
  
  const resetAuthInfo = async () => {
    // const fitbitRepository = new FitbitRepository(fitbitAuthContext);
    // const {access_token, refresh_token} = await fitbitRepository.refreshAccessToken();
    // setFitbitAuthInfo(fitbitAuthContext.copyWith(
    //   {access_token: access_token, refresh_token: refresh_token}
    // ));
    setUser(null);
    setFitbitLoginContext(false);
    setFitbitAuthInfo(FitbitAuthModelFactory.create());
  };

  useEffect(() => {
    const fitbitRepository = new FitbitRepository(fitbitAuthContext);
    fitbitRepository.fetchUserProfile().then(
      (userData: User|Error) => {
        setUser(userData);
        if (userData instanceof Error){
          setFitbitLoginContext(false);
        } else {
          setFitbitAuthInfo(fitbitAuthContext.copyWith({
            user_id: userData.id,
            user_name: userData.name,
            avatar_url: userData.avatar_url
          }))
          setFitbitLoginContext(true);
        }
      }
    ).catch((error) => {
      console.error(error);
    })
  }, [fitbitAuthContext, setFitbitAuthInfo, setFitbitLoginContext]);

  if (!fitbitLoginContext){
    return(
    <div>
        <p>fitbitにログインしていません</p>
        <Button type="primary" size="large" onClick={handleAuthClick}>認証ページへ</Button>
    </div>
    );
  }
  if (user instanceof Error){
    return(
      <div>
        <p>ユーザー情報の取得時にエラーが発生しました</p>
        <Button type="primary" size="large" onClick={() => resetAuthInfo()}>認証情報をリセット</Button>
      </div>
    );
  }
  
  // ユーザーがまだ取得されていない場合、ローディング画面を表示
  if (user === null) {
    return (
      <div>
        <Button type="primary" size="large" loading>
          Loading
        </Button>
      </div>
    );
  }

  // ユーザーが取得された場合、プロファイルを表示
  return (
    <div>
      <p>ログイン済みfitbitユーザー</p>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}

export default FitbitUserProfileBlock;

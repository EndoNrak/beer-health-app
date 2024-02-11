import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'antd'; 

import CognitoRepository from '../../repositories/cognitoRepository';
import { User } from  '../../models/userModel';
import { CognitoAuthContext, CognitoLoginContext } from '../../contexts/cognitoAuthContext';
import { CognitoAuthModel, CognitoAuthModelFactory} from '../../models/cognitoAuthModel';

const CognitoUserProfileBlock = () => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext);
  const [cognitoLoginContext, setCognitoLoginContext] = useContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(CognitoLoginContext);
  const [user, setUser] = useState<User | null | Error>(null);
  const handleAuthClick = () => {
    const auth = CognitoAuthModelFactory.create();
    setCognitoAuthInfo(auth);
    window.location.href = auth.login_url;
  };
  const resetAuthInfo = async ()=> {
    // const cognitoRepository = new CognitoRepository(cognitoAuthContext);
    // const {access_token, refresh_token} = await cognitoRepository.refreshAccessToken();
    // setCognitoAuthInfo(cognitoAuthContext.copyWith(
    //   {access_token: access_token, refresh_token: refresh_token}
    // ));
    setUser(null);
    setCognitoLoginContext(false);
    setCognitoAuthInfo(CognitoAuthModelFactory.create());
  };

  useEffect(() => {
    const cognitoRepository = new CognitoRepository(cognitoAuthContext);
    cognitoRepository.fetchUserProfile().then(
      (userData: User|Error) => {
        setUser(userData);
        if (userData instanceof Error){
          setCognitoLoginContext(false);
        } else {
          setCognitoLoginContext(true);
          setCognitoAuthInfo(
            cognitoAuthContext.copyWith({
              user_id: userData.id,
              user_name: userData.name
            })
          )
        }
      }
    ).catch((error) => {
      console.error(error);
    })
  }, [cognitoAuthContext, setCognitoAuthInfo, setCognitoLoginContext]);


  if (!cognitoLoginContext){
    return(
      <div>
        <p>cognitoにログインしていません</p>
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
      <p>ログイン済みcognitoユーザー</p>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}

export default CognitoUserProfileBlock;

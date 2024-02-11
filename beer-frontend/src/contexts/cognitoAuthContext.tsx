import { useState, useEffect } from 'react';
import { createContext } from 'react';
import { CognitoAuthModel, CognitoAuthModelFactory } from '../models/cognitoAuthModel';

export const CognitoAuthContext = createContext<[CognitoAuthModel,  React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>([CognitoAuthModelFactory.create(), ()=>{}]);
export const CognitoLoginContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, ()=>{}]);

export const CognitoAuthContextProvider = (props: any) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [authInfo, setAuthInfo] = useState<CognitoAuthModel>(getDefaultCognitoAuthInfo());

  useEffect(() => {
    // authInfoに正しく値がセットされていたらstorageに保存
    if (authInfo.access_token !== "" && !authInfo.is_guest_login) {
      setAutoInfoToLocalStorage(authInfo);
    }
  }, [authInfo]);

  return (
    <CognitoLoginContext.Provider value={[loggedIn, setLoggedIn]}>
      <CognitoAuthContext.Provider value={[authInfo, setAuthInfo]}>
        {props.children}
      </CognitoAuthContext.Provider>
    </CognitoLoginContext.Provider>
  );
}

/*
* デフォルトのAuthInfoを取得
* ローカルストレージから取得できた場合はその値をパース
*/
function getDefaultCognitoAuthInfo(): CognitoAuthModel {
  const defaultCognitoAuthInfo = window.localStorage.getItem("CognitoAuthInfo");
  if (defaultCognitoAuthInfo) {
    return CognitoAuthModelFactory.createFromJson(JSON.parse(defaultCognitoAuthInfo));
  } else {
    return CognitoAuthModelFactory.create();
  }
}

/**
* 認証情報をローカルストレージに追加
*/
function setAutoInfoToLocalStorage(authInfo: CognitoAuthModel): void {
  const authInfoStringify = JSON.stringify(authInfo);
  window.localStorage.setItem("CognitoAuthInfo", authInfoStringify);
}

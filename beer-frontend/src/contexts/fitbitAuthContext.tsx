import { useState, useEffect, createContext } from 'react';
import { FitbitAuthModel, FitbitAuthModelFactory } from '../models/fitbitAuthModel';

export const FitbitAuthContext= createContext<[FitbitAuthModel, React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>([FitbitAuthModelFactory.create(), ()=>{}]);
export const FitbitLoginContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, ()=>{}]);

export const FitbitAuthContextProvider = (props: any) => {
    // stateの定義
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [authInfo, setAuthInfo] = useState<FitbitAuthModel>(getDefaultFitbitAuthInfo());
  
    useEffect(() => {
      // authInfoに正しく値がセットされているかどうかをチェック
      if (authInfo?.access_token !== "" &&  !authInfo.is_guest_login) {
        setAutoInfoToLocalStorage(authInfo);
      } else {
        setLoggedIn(false);
      }
    }, [authInfo]);
  
    return (
      <FitbitLoginContext.Provider value={[loggedIn, setLoggedIn]}>
        <FitbitAuthContext.Provider value={[authInfo, setAuthInfo]}>
          {props.children}
        </FitbitAuthContext.Provider>
      </FitbitLoginContext.Provider>
    );
  }

/*
* デフォルトのAuthInfoを取得
* ローカルストレージから取得できた場合はその値をパース
* 取得できない場合は空の情報を返す
*/
function getDefaultFitbitAuthInfo(): FitbitAuthModel {
    const defaultFitbitAuthInfo = window.localStorage.getItem("FitbitAuthInfo");
    if (defaultFitbitAuthInfo) {
      return FitbitAuthModelFactory.createFromJson(JSON.parse(defaultFitbitAuthInfo));
    } else {
      return FitbitAuthModelFactory.create();
    }
  }
  
  /**
  * 認証情報をローカルストレージに追加
  */
  function setAutoInfoToLocalStorage(authInfo: FitbitAuthModel): void {
    const authInfoStringify = JSON.stringify(authInfo);
    window.localStorage.setItem("FitbitAuthInfo", authInfoStringify);
  }

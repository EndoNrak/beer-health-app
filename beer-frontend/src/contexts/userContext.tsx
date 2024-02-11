import { useState, useEffect } from 'react';
import { createContext } from 'react';
import { User } from  '../models/userModel'

export const UserContext = createContext<[User | null,  React.Dispatch<React.SetStateAction<User | null>>]>([null, ()=>{}]);

export const UserContextProvider = (props: any) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    setUserInfo(userInfo);
  }, [userInfo]);

  return (
    <UserContext.Provider value={[userInfo, setUserInfo]}>
      {props.children}
    </UserContext.Provider>
  );
}

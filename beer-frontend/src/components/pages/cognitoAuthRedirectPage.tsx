import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoAuthContext } from '../../contexts/cognitoAuthContext';
import { CognitoAuthModel } from '../../models/cognitoAuthModel';
import CognitoRepository from '../../repositories/cognitoRepository';

const CognitoAuthRedirectPage = () => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const cognitoRepository: CognitoRepository = new CognitoRepository(cognitoAuthContext);
    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const code: string | null = urlParams.get('code');
    if (code === null) {
      console.error("認証コードがありません。");
      return;
    }
    cognitoRepository.getAccessToken(code)
    .then(data => {
      if (cognitoAuthContext) {
        setCognitoAuthInfo(
          cognitoAuthContext.copyWith({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })
        );
      }
      navigate("/auth");
      }
    )
    .catch(error => {
      console.error("トークンリクエストエラー:", error);
    });
  }, [cognitoAuthContext, location.search, navigate, setCognitoAuthInfo]);

  return <div>認証中...</div>;

}

export default CognitoAuthRedirectPage;

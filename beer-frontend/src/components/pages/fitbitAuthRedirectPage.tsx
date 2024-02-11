import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FitbitAuthContext } from '../../contexts/fitbitAuthContext';
import { FitbitAuthModel } from '../../models/fitbitAuthModel';
import FitbitRepository from '../../repositories/fitbitRepository';

const FitbitAuthRedirectPage = () => {
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel, React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fitbitRepository: FitbitRepository = new FitbitRepository(fitbitAuthContext);
    const urlParams: URLSearchParams = new URLSearchParams(location.search);
    const code: string | null = urlParams.get('code');
    if (code === null) {
      console.error("認証コードがありません。");
      return;
    }
    // const returnedState = urlParams.get('state');
   fitbitRepository.getAccessToken(code)
    .then(data => {
        setFitbitAuthInfo(
          fitbitAuthContext.copyWith({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })
        );
        navigate("/auth");
      }
    )
    .catch(error => {
      console.error("トークンリクエストエラー:", error);
    });
  }, [location.search, fitbitAuthContext, navigate, setFitbitAuthInfo]);

  return <div>認証中...</div>;
}

export default FitbitAuthRedirectPage;

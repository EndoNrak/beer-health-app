import CognitoInfrastructure from "../infrastructures/cognitoInfrastructure";
import { CognitoAuthModel } from "../models/cognitoAuthModel";
import { User, CognitoUserFactory } from "../models/userModel";

interface CognitoRepository {
  fetchUserProfile(): Promise<User | Error>;
  refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }>;
  getAccessToken(code: string): Promise<{ access_token: string; refresh_token: string }>;
}

class CognitoRepositoryImpl implements CognitoRepository {
  private cognitoInfrastructure: CognitoInfrastructure;

  constructor(cognitoAuthContext: CognitoAuthModel) {
    this.cognitoInfrastructure = new CognitoInfrastructure(cognitoAuthContext);
  }

  async fetchUserProfile(): Promise<User | Error> {
    try {
      const response: Response = await this.cognitoInfrastructure.fetchUserProfile();
      const jsonData: Record<string, string> = await response.json();
      return CognitoUserFactory.fromJson(jsonData);
    } catch (error) {
      console.error(error);
      return Error("ユーザー情報の取得に失敗しました");
    }
  }

  async refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const {access_token, refresh_token} = await this.cognitoInfrastructure.refreshAccessToken();
      return {
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error refreshing access token. Please check the error message in the console.");
    }
  }

  async getAccessToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const {access_token, refresh_token} = await this.cognitoInfrastructure.getAccessToken(code);
      return {
        access_token: access_token,
        refresh_token: refresh_token,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error refreshing access token. Please check the error message in the console.");
    }
  }
}

export default CognitoRepositoryImpl;

import { REACT_APP_COGNITO_USER_POOL_DOMAIN } from "../env";
import { CognitoAuthModel } from "../models/cognitoAuthModel";

class CognitoInfrastructure {
  private cognitoAuth: CognitoAuthModel;

  constructor(cognitoAuthContext: CognitoAuthModel) {
    this.cognitoAuth = cognitoAuthContext;
  }

  async fetchUserProfile(): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = '/oauth2/userInfo';
    const response: Response = await fetch(`${REACT_APP_COGNITO_USER_POOL_DOMAIN}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }
  
  async refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }> {
    const headers = new Headers({
      'Authorization': `Basic ${this.cognitoAuth.basic_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams({
      "AuthFlow": "REFRESH_TOKEN",
      "ClientId": this.cognitoAuth.client_id,
      "AuthParameters": JSON.stringify({
        "REFRESH_TOKEN": this.cognitoAuth.refresh_token,
        "SECRET_HASH": this.cognitoAuth.secret_hash
      })
    });

    const endpoint: string = '/oauth2/token';
    const response: Response = await fetch(`${this.cognitoAuth.auth_domain}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh access token. Status: ${response.status}`);
    }

    const jsonData = await response.json();
    return {
      access_token: jsonData.access_token,
      refresh_token: jsonData.refresh_token,
    };
  }

  async getAccessToken(code: string): Promise<{access_token: string, refresh_token: string}>{
    const tokenRequestData = new URLSearchParams();
    tokenRequestData.append("grant_type", "authorization_code");
    tokenRequestData.append("redirect_uri", this.cognitoAuth.redirect_login_url);
    tokenRequestData.append("code", code);

    const tokenRequest = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.cognitoAuth.basic_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestData.toString(),
    };

    const endpoint: string = '/oauth2/token';
    const response: Response = await fetch(`${this.cognitoAuth.auth_domain}${endpoint}`, tokenRequest);

    if (!response.ok) {
      throw new Error(`Failed to refresh access token. Status: ${response.status}`);
    }
    const jsonData = await response.json();
    return {
      access_token: jsonData.access_token,
      refresh_token: jsonData.refresh_token,
    };
  }
}

export default CognitoInfrastructure;

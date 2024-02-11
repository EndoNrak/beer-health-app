import { FitbitAuthModel } from "../models/fitbitAuthModel";

class FitbitInfrastructure {
  private fitbitApiBaseUrl: string = "https://api.fitbit.com";
  private fitbitAuth: FitbitAuthModel

  constructor(fitbitAuthContext: FitbitAuthModel) {
    this.fitbitAuth = fitbitAuthContext;
  }

  async fetchUserProfile(): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.fitbitAuth.access_token}`,
    });
    const endpoint: string = '/1/user/-/profile.json';
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async refreshAccessToken(): Promise<{access_token: string, refresh_token: string}> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.fitbitAuth.access_token}`,
    });

    const tokenRequestData = new URLSearchParams();
    tokenRequestData.append("grant_type", "refresh_token");
    tokenRequestData.append("refresh_token", this.fitbitAuth.refresh_token);
    tokenRequestData.append("client_id", this.fitbitAuth.client_id);

    const endpoint: string = '/oauth2/token';
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    const jsonData = await response.json();
    return {
      access_token: jsonData.access_token,
      refresh_token: jsonData.refresh_token,
    };
  }

  async getAccessToken(code: string): Promise<{access_token: string, refresh_token: string}> {
    const tokenRequestData = new URLSearchParams();
    tokenRequestData.append("grant_type", "authorization_code");
    tokenRequestData.append("redirect_uri", this.fitbitAuth.redirect_login_url);
    tokenRequestData.append("code", code);

    const tokenRequest = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.fitbitAuth.get_basic_token()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestData.toString(),
    };
  
    const endpoint: string = '/oauth2/token';
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}`, tokenRequest);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    const jsonData = await response.json();
    return {
      access_token: jsonData.access_token,
      refresh_token: jsonData.refresh_token,
    };
  }

  async getActivityLogs(): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.fitbitAuth.access_token}`,
    });
    
    const query = new URLSearchParams({
      "beforeDate": "2023-11-05",
      "sort": "asc",
      "limit": "10",
      "offset": "0"
    });
    const endpoint: string = '/1/user/-/activities/list.json';
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}?${query}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  
  async getDayCalories(day: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.fitbitAuth.access_token}`,
    });
    const endpoint: string = `/1/user/-/activities/calories/date/${day}/1d.json`;
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async getDaySteps(day: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.fitbitAuth.access_token}`,
    });
    const endpoint: string = `/1/user/-/activities/steps/date/${day}/1d.json`;
    const response: Response = await fetch(`${this.fitbitApiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }
}

export default FitbitInfrastructure;

import { REACT_APP_API_URL } from '../env';
import { CognitoAuthModel } from '../models/cognitoAuthModel';
import { Message } from '../models/messageModel';

class ApiInfrastructure {
  private apiBaseUrl: string = REACT_APP_API_URL;
  private cognitoAuth: CognitoAuthModel;

  constructor(cognitoAuthContext: CognitoAuthModel) {
    this.cognitoAuth = cognitoAuthContext;
  }

  async fetchData(endpoint: string): Promise<Response> {
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async getGoalsOnUserId(userId: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/users/${userId}/goals`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async getLatestGoalsOnUserId(userId: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`
    });
    const endpoint: string = `/users/${userId}/goals/latest`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async getDevicesOnUserId(userId: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`
    });
    const endpoint: string = `/users/${userId}/devices`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async postNewGoal(userId: string, goalData: any): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/users/${userId}/goal`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(goalData), // Convert goal data to JSON string
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }

  async sendMessageToBeerServer(deviceId: string, message: any): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/server/power`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(message), // Convert goal data to JSON string
    });
    return response;
  }

  async postNewMessage(prompt: string, messages:Message[], user_name: string, ): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/chat`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        prompt: prompt,
        message_list: messages,
        user_name: user_name
      }), 
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response;
  }
  
  async postStartBeerServer(deviceId: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/devices/${deviceId}/start`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers
    });
    return response;
  }

  async postStopBeerServer(deviceId: string): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/devices/${deviceId}/stop`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers
    });
    return response;
  }

  async getAssistants(): Promise<Response> {
    const headers = new Headers({
      'Authorization': `Bearer ${this.cognitoAuth.access_token}`,
    });
    const endpoint: string = `/instructors`;
    const response: Response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      method: 'GET',
      headers: headers
    });
    return response;
  }
}

export default ApiInfrastructure;

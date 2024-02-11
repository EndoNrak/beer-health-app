import FitbitInfrastructure from "../infrastructures/fitbitInfrastructure";
import { User, FitbitUserFactory } from "../models/userModel";
import { Activity, ActivityFactory } from "../models/activityModel";
import { DayCalories, DayCaloriesFactory } from "../models/dayCaloriesModel";
import { DaySteps, DayStepsFactory } from "../models/dayStepsModel";
import { FitbitAuthModel } from "../models/fitbitAuthModel";

interface FitbitRepository {
  fetchUserProfile(): Promise<User | Error>;
  getActivityLogs(): Promise<Activity[]>;
  getTodayCalories(): Promise<DayCalories>;
  getTodaySteps(): Promise<DaySteps>;
  refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }>;
  getAccessToken(code: string): Promise<{ access_token: string; refresh_token: string }>;
}

class FitbitRepositoryImpl implements FitbitRepository {
  private fitbitApiInfrastructure: FitbitInfrastructure;

  constructor(fitbitAuthcontext: FitbitAuthModel) {
    this.fitbitApiInfrastructure = new FitbitInfrastructure(fitbitAuthcontext);
  }

  async fetchUserProfile(): Promise<User | Error> {
    try {
      const response: Response = await this.fitbitApiInfrastructure.fetchUserProfile();
      const jsonData: Record<string, string> = await response.json();
      return FitbitUserFactory.fromJson(jsonData);
    } catch (error) {
      console.error(error);
      return Error("ユーザー情報の取得に失敗しました");
    }
  }

  async getActivityLogs(): Promise<Activity[]> {
    try {
      const response: Response = await this.fitbitApiInfrastructure.getActivityLogs();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData: { activities: Activity[] } = await response.json();
      const activities = jsonData.activities.map((activityData: Activity) => {
        return ActivityFactory.fromJson(activityData);
      });
      return activities;
    } catch (error) {
      console.error(error);
      throw new Error("Error in getActivityLog method. Please check the error message in the console.");
    }
  }

  async getTodayCalories(): Promise<DayCalories> {
    try {
      const response: Response = await this.fitbitApiInfrastructure.getDayCalories("today");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      return DayCaloriesFactory.fromJson(jsonData["activities-calories"][0]);
    } catch (error) {
      console.error(error);
      throw new Error("Error in getActivityLog method. Please check the error message in the console.");
    }
  }

  async getTodaySteps(): Promise<DaySteps> {
    try {
      const response: Response = await this.fitbitApiInfrastructure.getDaySteps("today");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      return DayStepsFactory.fromJson(jsonData["activities-steps"][0]);
    } catch (error) {
      console.error(error);
      throw new Error("Error in getActivityLog method. Please check the error message in the console.");
    }
  }
  async refreshAccessToken(): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const {access_token, refresh_token} = await this.fitbitApiInfrastructure.refreshAccessToken();
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
      const {access_token, refresh_token} = await this.fitbitApiInfrastructure.getAccessToken(code);
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

export default FitbitRepositoryImpl;

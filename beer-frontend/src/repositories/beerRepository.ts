import ApiInfrastructure from '../infrastructures/apiInfrastructure';
import { ActivityGoalModel } from '../models/activityGoalModel';
import { DeviceFactory, DeviceModel } from '../models/deviceModel';
import { CognitoAuthModel } from '../models/cognitoAuthModel';

interface BeerRepository {
  helloApi(): Promise<string>;
  getGoalsByUserId(userId: string): Promise<ActivityGoalModel[] | Error>;
  getLatestGoal(userId: string): Promise<ActivityGoalModel | null | Error>;
  getDevicesByUserId(userId: string): Promise<DeviceModel[] | Error>;
  postNewGoal(userId: string, goal: ActivityGoalModel): Promise<string | Error>;  
  startBeerServer(deviceId: string): Promise<string | Error>;
}

class BeerRepositoryImpl implements BeerRepository {
  private apiInfrastructure: ApiInfrastructure;

  constructor(cognitoAuthContext: CognitoAuthModel) {
    this.apiInfrastructure = new ApiInfrastructure(cognitoAuthContext);
  }

  async helloApi(): Promise<string> {
    const endpoint: string = '/activities/today';
    const message: string = await this.apiInfrastructure.fetchData(endpoint).then(
      (response: Response) => response.json()
    )
    .then((jsonData: Record<string, string>) => jsonData.message)
    .catch((error) => {
      console.error(error);
      return "error in helloApi method. please confirm error message in console";
    })
    return message;
  }

  async getGoalsByUserId(userId: string): Promise<ActivityGoalModel[] | Error> {
    if (userId==="" || userId===undefined){
      return Error("userId caonnet be empty");
    }
    const goals: ActivityGoalModel[] | Error = await this.apiInfrastructure.getGoalsOnUserId(userId)
    .then((response: Response) => response.json())
    .then((jsonData: any[]) => jsonData.map((json: Record<string, any>) => ActivityGoalModel.fromJson(json)))
    .catch((error) => {
      console.error(error);
      return Error(error);
    })
    return goals;
  }

  async getDevicesByUserId(userId: string): Promise<DeviceModel[] | Error> {
    if (userId==="" || userId===undefined){
      return Error("userId caonnet be empty");
    }
    // const devices: Device[] | Error = await this.apiInfrastructure.getDevicesOnUserId(userId)
    // .then((response: Response) => response.json())
    // .then((jsonData: any[]) => jsonData.map((json: Record<string, any>) => DeviceFactory.fromJson(json)))
    // .catch((error) => {
    //   console.error(error);
    //   return Error(error);
    // })
    const jsonData: any[] = [
      {
        "id": "15469460",
        "name": "ビールサーバ1",
        "status": "ready",
        "type": "beer_server",
        "image_src": "https://www.green-house.co.jp/wp-content/uploads/wm-gh-beers.png"
      },
      {
        "id": "212768",
        "name": "ビールサーバ2",
        "status": "offline",
        "type": "beer_server",
        "image_src": "https://www.green-house.co.jp/wp-content/uploads/wm-gh-beers.png"
      }
    ];
    const devices: DeviceModel[] = jsonData.map((json: Record<string, any>) => DeviceFactory.fromJson(json));
    await new Promise(s => setTimeout(s, 500));
    return devices;
  }

  async getLatestGoal(userId: string): Promise<ActivityGoalModel | null | Error> {
    if (userId==="" || userId===undefined){
      return Error("userId caonnet be empty");
    }
    const goal: ActivityGoalModel | null | Error = await this.apiInfrastructure.getLatestGoalsOnUserId(userId)
    .then((response: Response) => response.json())
    .then((jsonData: any) => {
      if(jsonData[0]!==undefined){
        return ActivityGoalModel.fromJson(jsonData[0]);
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return Error(error);
    })
    return goal;
  }

  async postNewGoal(userId: string, goal: ActivityGoalModel): Promise<string | Error> {
    if (userId==="" || userId===undefined){
      return Error("userId caonnet be empty");
    }
    const result: string | Error = await this.apiInfrastructure.postNewGoal(userId, goal)
    .then((response: Response)=>{
      return response.status===200? "successfully started" : "submition failed";
    })
    .catch((error) => {
      return Error(error);
    })
    return result;
  }

  async startBeerServer(deviceId: string): Promise<string | Error>{
    if (deviceId==="" || deviceId===undefined){
      return Error("userId caonnet be empty");
    }
    const result: string | Error = await this.apiInfrastructure.postStartBeerServer(deviceId)
    .then((response: Response)=>{
      return response.status===200? "successfully started" : "submition failed";
    })
    .catch((error: any) => {
      return Error(error);
    })
    return result;
  }

  async stopBeerServer(deviceId: string): Promise<string | Error>{
    if (deviceId==="" || deviceId===undefined){
      return Error("userId caonnet be empty");
    }
    const result: string | Error = await this.apiInfrastructure.postStopBeerServer(deviceId)
    .then((response: Response)=>{      
      return response.status===200? "successfully started" : "submition failed";
    })
    .catch((error: any) => {
      return Error(error);
    })
    return result;
  }
}

export default BeerRepositoryImpl;

import { MessageFactory, MessageModel, MessageModelFactory } from "../models/messageModel";
import ApiInfrastructure from "../infrastructures/apiInfrastructure";
import { CognitoAuthModel } from "../models/cognitoAuthModel";
import { AssistantModel, AssistantModelFactory } from "../models/assistantModel";

interface ChatRepository {
  postMessage(messages: MessageModel[], prompt: string, user_name: string): Promise<MessageModel | Error>;
  startConversation(prompt: string, user_name: string): Promise<MessageModel | Error>;
  getAssistantList(): Promise<AssistantModel[] | Error>;
}

class ChatRepositoryImpl implements ChatRepository {
  private apiInfrastructure: ApiInfrastructure;
  constructor(cognitoAuthContext: CognitoAuthModel) {
    this.apiInfrastructure = new ApiInfrastructure(cognitoAuthContext);
  }

  async postMessage(messages: MessageModel[], prompt: string, user_name: string): Promise<MessageModel | Error> {
    const responseMessage: MessageModel | Error = await this.apiInfrastructure.postNewMessage(
      prompt, 
      messages.map((x) => MessageFactory.createMessage(
        x.is_sender_user?"user":"assistant",
        x.message,
        x.reaction_messages
      )),
      user_name
    )
    .then((response: Response) => response.json())
    .then((jsonData: any[]) => MessageModelFactory.fromJson(jsonData))
    .catch((error) => {
      console.error(error);
      return Error(error);
    })
    return responseMessage;
  }

  async startConversation(prompt: string, user_name: string): Promise<MessageModel | Error> {
    const responseMessage: MessageModel | Error = await this.apiInfrastructure.postNewMessage(prompt, [], user_name)
    .then((response: Response) => response.json())
    .then((jsonData: any[]) => MessageModelFactory.fromJson(jsonData))
    .catch((error) => {
      console.error(error);
      return Error(error);
    })
    return responseMessage;
  }

  async getAssistantList(): Promise<AssistantModel[] | Error>{
    const response: AssistantModel[] | Error = await this.apiInfrastructure.getAssistants()
    .then((response: Response)=> response.json())
    .then((jsonData: any[]) => jsonData.map(AssistantModelFactory.fromJson))
    .catch((error) => {
      console.error(error);
      return Error(error);
    })
    return response;
  }
}

export default ChatRepositoryImpl;
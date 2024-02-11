export interface MessageModel {
    message: string,
    is_sender_user: boolean,
    reaction_messages: string[],
    goal: number
};

export type Message = {
  role: string;
  content: string;
  user_reaction?: string[];
  goal?: number;
};

export class MessageFactory {
  static createMessage(role: string, content: string, user_reaction?: string[], goal?: number): Message {
    return {
      role,
      content,
      user_reaction,
      goal
    };
  }
}

export class MessageModelFactory {
  static fromJson(json: any): MessageModel {
    const _json = JSON.parse(json.response);
    return {
      message: _json.system || "",
      is_sender_user: false,
      reaction_messages: _json.user_reaction || [],
      goal: _json.goal || 0,
    };
  }
}
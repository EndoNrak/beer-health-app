import { useNavigate } from 'react-router-dom';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ChatContainer,
  MessageInput,
  ConversationHeader,
  Avatar,
  Message,
  MessageList,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { Button, Col, Modal, Row, notification} from "antd";
import { useContext, useEffect, useState } from "react";
import { MessageModel } from "../../models/messageModel";

import { ActivityGoalModel } from '../../models/activityGoalModel';
import ChatRepository from "../../repositories/chatRepository";
import { CognitoAuthContext } from "../../contexts/cognitoAuthContext";
import { CognitoAuthModel } from "../../models/cognitoAuthModel";
import AssistantCard from "../blocks/assistantCard";
import { AssistantModel } from "../../models/assistantModel";
import ActivityGoalForm from "../blocks/activityGoalSettingBlock";
import { FitbitAuthContext } from '../../contexts/fitbitAuthContext';
import { FitbitAuthModel } from '../../models/fitbitAuthModel';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { shuffleArray } from '../../utils/shuffleArray';

const ChatPage: React.FC = () => {
  const [cognitoAuthContext, setCognitoAuthInfo] = useContext<[CognitoAuthModel, React.Dispatch<React.SetStateAction<CognitoAuthModel>>]>(CognitoAuthContext); // eslint-disable-line
  const [fitbitAuthContext, setFitbitAuthInfo] = useContext<[FitbitAuthModel, React.Dispatch<React.SetStateAction<FitbitAuthModel>>]>(FitbitAuthContext); // eslint-disable-line

  const [messageList, setMessageList] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assistant, setAssistant] = useState<AssistantModel | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [assistantList, setAssistantList] = useState<AssistantModel[]>([]);
  const [inputAvailable, setInputAvailable] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const chatRepository: ChatRepository = new ChatRepository(cognitoAuthContext);
    chatRepository.getAssistantList()
    .then(
      (data)=>{
        if (data instanceof Error){
          api.info({
            message: "Information",
            description:
              'インストラクター一覧の取得に失敗しました',
            onClose: () => navigate("/goal")
          });
        } else {
          data = shuffleArray(data);
          setAssistantList(data);
        }
      }
    );
  }, [cognitoAuthContext, api, navigate]);

  const handleOk = async () => {
    setConfirmLoading(true);
    await startConversation();
    setModalOpen(false);
    setConfirmLoading(false);
  };

  const onSelected = (index: number) => {
    setSelected(index);
    setAssistant(assistantList[index]);
  }

  const onSendHandler = async (message: string) => {
    const newMessage: MessageModel = {
      message: message,
      is_sender_user: true,
      reaction_messages: [],
      goal: 0
    };
    setMessageList((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    setInputAvailable(false);
    const chatRepository: ChatRepository = new ChatRepository(cognitoAuthContext);
    const responseMessage: MessageModel | Error = await chatRepository.postMessage([...messageList, newMessage], assistant ? assistant.prompt: "一般的なトレーナーです", fitbitAuthContext.user_name);
    if (responseMessage instanceof Error){
      return;
    }
    setMessageList((prevMessages) => [...prevMessages, responseMessage]);
    setIsLoading(false); 
    setInputAvailable(true);
  };

  const startConversation = async () => {
    setIsLoading(true);
    const chatRepository: ChatRepository = new ChatRepository(cognitoAuthContext);
    const responseMessage: MessageModel | Error = await chatRepository.startConversation(assistant ? assistant.prompt: "一般的なトレーナーです", fitbitAuthContext.user_name);
    if (responseMessage instanceof Error){
      return;
    }
    setMessageList((prevMessages) => [...prevMessages, responseMessage]);
    setIsLoading(false);    
    setInputAvailable(true);
  };

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: "Information",
      description:
        'ゲストモードでは目標設定を実施できません。目標管理画面で手動で入力してください。このメッセージを閉じると目標管理画面に戻ります。',
      onClose: () => navigate("/goal/guest"),
      placement
    });
  };

  const onFinishCallback = () => {
    if (fitbitAuthContext.is_guest_login){
      openNotification("top");
    } else {
      navigate("/goal");
    }
  }

  return (
    <>
    {contextHolder}
    <div style={{height: "80vh", marginTop: 20}}>
      <ChatContainer>
        <ConversationHeader>
          <ConversationHeader.Content userName={assistant?.name} info={assistant?.description} />      
        </ConversationHeader>
        <MessageList
          typingIndicator={isLoading ? <TypingIndicator content="typing" /> : null}
        >
          {messageList.length === 0 && (
            <MessageList.Content style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              fontSize: "1.2em"
            }}>
              <Modal
                title="アシスタントの選択"
                centered
                closable = {false}
                open={modalOpen}
                confirmLoading={confirmLoading}
                width={"90%"}
                footer={[
                  <Button key="Ok" onClick={handleOk} type="primary" loading={confirmLoading} disabled={assistant == null}>
                    Ok
                  </Button>
                ]}
              >
                <div>                  
                  <Row gutter={[16, 16]}>
                    {assistantList.map((assistant, index) => (
                      <Col key={index} xs={12} sm={8} md={8} lg={6}>
                        <div key={index} onClick={()=>onSelected(index)}>
                          <AssistantCard assistant={assistant} selected={selected === index}/>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Modal>
            </MessageList.Content>
          )}
          {messageList.length > 0 && (
            <MessageList.Content style={{marginTop: 5}}>
              {messageList.map((message, index) => (
                <>
                  {!message.is_sender_user && <Avatar size='lg' children={<img src={assistant?.image_src} alt={assistant?.name} style={{objectFit: 'cover'}}></img>}/>}
                  <Message
                    key={index}
                    model={{
                      message: message.message,
                      direction: message.is_sender_user ? "outgoing": "incoming",
                      position: "single"
                    }}
                    avatarSpacer={!message.is_sender_user}
                  />
                </>
               
              ))}
              {messageList.length > 0 && messageList[messageList.length - 1].reaction_messages.length > 0 && (
                <div>
                  <br/>
                  {messageList[messageList.length - 1].reaction_messages.map((reaction, index) => (
                    <Button
                      key={index}
                      type="link"
                      onClick={() => onSendHandler(reaction)}
                    >
                      {reaction}
                    </Button>
                  ))}
                </div>
              )}
              {messageList[messageList.length - 1].goal > 0 &&(
                <Button
                  type="link"
                  onClick={() => setGoalModalOpen(true)}
                >
                  目標設定画面に進む
                </Button>
              )}
              {messageList.length > 0 && messageList[messageList.length - 1].goal > 0 && (
                <Modal
                  title="新しい目標の設定"
                  footer={null}
                  centered
                  open={goalModalOpen}
                  closable = {true}
                >
                  <ActivityGoalForm
                    initialGoal={new ActivityGoalModel("", "steps", messageList[messageList.length - 1].goal, new Date())}
                    onFinish={onFinishCallback} 
                  />
                </Modal>
              )}
            </MessageList.Content>
          )}
        </MessageList>        
        <MessageInput
          onSend={onSendHandler}
          disabled={!inputAvailable}
        />
      </ChatContainer>
    </div>
    </>
  );
}

export default ChatPage;
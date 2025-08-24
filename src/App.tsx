import { message } from "antd";
import { messageService } from "./interfaces/appInterface";
import { UserProvider } from "./configs/globalVariable";
import AppRoute from "./routes/appRoute";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const keyMessage = "message-custome"
  messageService.success = (content: string) => {
    messageApi.open({ 
      key: keyMessage,
      type: "success", 
      content: (
        <div onClick={() => {messageApi.destroy(keyMessage)}} style={{cursor: "pointer"}}>
          {content}
        </div>
      )
    });
  };
  messageService.error = (content: string) => {
    messageApi.open({ 
      key: keyMessage,
      type: "error", 
      content: (
        <div onClick={() => {messageApi.destroy(keyMessage)}} style={{cursor: "pointer"}}>
          {content}
        </div>
      )
    });
  };

  return (
    <>
      {contextHolder}
      <UserProvider>
        <AppRoute />
      </UserProvider>
    </>
  )
}

export default App

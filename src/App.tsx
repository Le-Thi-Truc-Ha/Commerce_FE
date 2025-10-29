import { message } from "antd";
import { messageService } from "./interfaces/appInterface";
import { UserContext, UserProvider } from "./configs/globalVariable";
import AppRoute from "./routes/appRoute";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateQuantityCartApi } from "./services/customerService";
import dayjs from "dayjs";
import { checkUpdateCartApi } from "./services/appService";

function App() {
  const {quantityOrder, setQuantityOrder, isLoading, setIsLoading} = useContext(UserContext);
  const location = useLocation();
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

  useEffect(() => {
    checkUpdateCart()
  }, [])

  // Vừa vào web phải kiểm tra số lượng sản phẩm đã được cập nhật chưa bằng cách so sánh thời gian updateAt giữa local storage và database
  // Nếu trong local storage xảy ra trước thì xóa quantityChange và updateAt do lần trước tắt trình duyệt chỉ kịp lưu mà chưa kịp xóa dữ liệu trong local storage
  // Nếu trong database xảy ra trước thì lấy quantityChange trong local storage để cập nhật lại và xóa dữ liệu trong local storage
  const checkUpdateCart = async () => {
    setIsLoading(true);
    const quantityChange = localStorage.getItem("quantityChange");
    const updateAt = localStorage.getItem("updateAt");

    if (!updateAt || !quantityChange) {
      setIsLoading(false);
      return
    }

    try {
      const cartId = JSON.parse(quantityChange).map((item: {cartId: number, quantityUpdate: number}) => (item.cartId))
      const result = await checkUpdateCartApi(cartId[0]);
      if (result.code == 0) {
        if (dayjs(updateAt).isAfter(dayjs(result.data.updateAt))) {
          const newUpdate = await updateQuantityCartApi(JSON.parse(quantityChange), dayjs().toISOString());
          if (newUpdate.code == 0) {
            localStorage.removeItem("quantityChange");
            localStorage.removeItem("updateAt")
            setQuantityOrder([]);
          }
        } else {
          localStorage.removeItem("quantityChange");
          localStorage.removeItem("updateAt")
          setQuantityOrder([]);
        }
      }
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  // Theo dõi biến quantityOrder (được khai báo trong globalVariable) để cập nhật vào local storage
  useEffect(() => {
    if (quantityOrder.length > 0) {
      localStorage.setItem("quantityChange", JSON.stringify(quantityOrder))
    }
  }, [quantityOrder])


  // Đây là code xử lý trường hợp người dùng tắt tab hoặc trình duyệt
  // Đặt thời gian hiện tại vào local storage, gọi api (public do sendBeacon không thể gửi kèm header nên không xác thực được)
  // Cập nhật số lượng sản phẩm trong giỏ hàng, ghi lại thời gian cập nhật vào database
  useEffect(() => {
    let hasSent = false;
    const handlePageHide = () => {
      if (hasSent) {
        return;
      }
      hasSent = true;
      const quantityCart = localStorage.getItem("quantityChange");
      if (quantityCart) {
        const now = dayjs().toISOString();
        const payload = {
          quantityCart: JSON.parse(quantityCart),
          updateAt: now
        }
        localStorage.setItem("updateAt", now)
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(import.meta.env.VITE_UPDATE_CART_URL, blob);
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  // Đây là code xử lý trong trường hợp người dùng chuyển hướng nội bộ
  // Theo dõi pathname để lưu dữ liệu khi người dùng chuyển hướng đến trang khác
  // Lấy dữ liệu (quantityChange) từ local storage để lưu
  // Sau khi lưu thành công thì xóa dữ liệu trong local storage
  // Đặt lại biến quantityOrder thành mảng rỗng
  // Lưu ý: Cách này không lưu thời điểm cập nhật do cách này có thể xóa dữ liệu trong local storage sau khi cập nhật xong
  useEffect(() => {
    const quantityCart = localStorage.getItem("quantityChange");
    if (quantityCart && !isLoading) {
      updateQuantityCart(JSON.parse(quantityCart));
    }
  }, [location.pathname])

  const updateQuantityCart = async (quantityCart: {cartId: number, quantityUpdate: number}[]) => {
    setIsLoading(true);
    try {
      const result = await updateQuantityCartApi(quantityCart, dayjs().toISOString());
      if (result.code == 0) {
        localStorage.removeItem("quantityChange");
        setQuantityOrder([]);
      }
    } catch(e) {
      console.log(e);
      messageService.error("Xảy ra lỗi ở server")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {contextHolder}
      <AppRoute />
    </>
  )
}

export default App

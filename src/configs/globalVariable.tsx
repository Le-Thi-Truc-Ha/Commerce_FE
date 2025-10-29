import { createContext, useEffect, useState, type Dispatch, type JSX, type ReactNode, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import * as appService from "../services/appService";
import { messageService, type BackendResponse } from "../interfaces/appInterface";
import { setSessionKey } from "../components/Other/Login";

export interface UserType {
    isAuthenticated: boolean,
    roleId: number,
    accountId: number,
    googleLogin: boolean,
}

interface UserContextType {
    user: UserType,
    loginContext: (userData: UserType) => void,
    logoutContext: () => void,
    isLoading: boolean,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    pathBeforeLogin: string,
    setPathBeforeLogin: Dispatch<SetStateAction<string>>,
    cart: number,
    setCart: Dispatch<SetStateAction<number>>,
    quantityOrder: {cartId: number, quantityUpdate: number}[],
    setQuantityOrder: Dispatch<SetStateAction<{cartId: number, quantityUpdate: number}[]>>
}

export const UserContext = createContext<UserContextType>({
    user: {isAuthenticated: false, roleId: -1, accountId: -1, googleLogin: false},
    loginContext: () => {},
    logoutContext: () => {},
    isLoading: false,
    setIsLoading: () => {},
    pathBeforeLogin: "/",
    setPathBeforeLogin: () => {},
    cart: 0,
    setCart: () => {},
    quantityOrder: [],
    setQuantityOrder: () => {}
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps): JSX.Element => {
    const userDefault: UserType = {isAuthenticated: false, roleId: -1, accountId: -1, googleLogin: false};
    const [user, setUser] = useState<UserType>(userDefault);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pathBeforeLogin, setPathBeforeLogin] = useState<string>("/");
    const [cart, setCart] = useState<number>(0);
    const [quantityOrder, setQuantityOrder] = useState<{cartId: number, quantityUpdate: number}[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        reloadPage();
    }, []);

    const reloadPage = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const result: BackendResponse = await appService.reloadPageApi();
            if (result.code == 0) {
                const userData: UserType = {
                    isAuthenticated: true,
                    accountId: result.data.account.accountId,
                    roleId: result.data.account.roleId,
                    googleLogin: result.data.account.googleLogin
                }
                setCart(result.data.cart);
                setUser(userData);
            } else if (result.code == 2) {
                setSessionKey(result.data, 30);
                setUser(userDefault);
                setCart(0);
            } else {
                setUser(userDefault);
                setCart(0);
            }
        } catch(e) {
            setUser({...userDefault});
            messageService.error("Xảy ra lỗi ở server");
        } finally {
            setIsLoading(false);
        }
    };

    const loginContext = (userData: UserType): void => {
        setUser({...userData});
    };

    const logoutContext = async (): Promise<void> => {
        navigate("/");
        if (user.isAuthenticated) {
            try {
                const result: BackendResponse = await appService.logoutApi();
                if (result.code == 0) {
                    setCart(0);
                    setUser(userDefault);
                    messageService.success(result.message);
                    localStorage.removeItem("sessionKey");
                    reloadPage();
                } else {
                    messageService.error(result.message);
                }
            } catch(e) {
                console.log(e);
                messageService.error("Xảy ra lỗi ở server");
            }
        } else {
            messageService.error("Bạn chưa đăng nhập");
        }
    }

    return(
        <UserContext.Provider 
            value={{
                user: user, 
                loginContext: loginContext, 
                logoutContext: logoutContext,
                isLoading: isLoading,
                setIsLoading: setIsLoading,
                pathBeforeLogin: pathBeforeLogin,
                setPathBeforeLogin: setPathBeforeLogin,
                cart: cart,
                setCart: setCart,
                quantityOrder: quantityOrder,
                setQuantityOrder: setQuantityOrder
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
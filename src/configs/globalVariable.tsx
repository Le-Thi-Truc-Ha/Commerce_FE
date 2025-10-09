import { createContext, useEffect, useState, type JSX, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import appService from "../services/appService";
import { messageService, type BackendResponse } from "../interfaces/appInterface";

export interface UserType {
    isAuthenticated: boolean;
    roleId: number;
    accountId: number;
    googleLogin: boolean;
}

interface UserContextType {
    user: UserType;
    loginContext: (userData: UserType) => void;
    logoutContext: () => void;
    isLoading: boolean;
    pathBeforeLogin: string;
    setPathBeforeLogin: (path: string) => void;
}

export const UserContext = createContext<UserContextType>({
    user: {isAuthenticated: false, roleId: -1, accountId: -1, googleLogin: false},
    loginContext: () => {},
    logoutContext: () => {},
    isLoading: false,
    pathBeforeLogin: "/",
    setPathBeforeLogin: () => {}
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({children}: UserProviderProps): JSX.Element => {
    const userDefault: UserType = {isAuthenticated: false, roleId: -1, accountId: -1, googleLogin: false};
    const [user, setUser] = useState<UserType>(userDefault);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pathBeforeLogin, setPathBeforeLogin] = useState<string>("/");
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
                    accountId: result.data.accountId,
                    roleId: result.data.roleId,
                    googleLogin: result.data.googleLogin
                }
                setUser(userData);
            } else {
                setUser(userDefault);
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
                    setUser(userDefault);
                    messageService.success(result.message);
                    localStorage.removeItem("sessionKey");
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
        <UserContext.Provider value={{user: user, loginContext: loginContext, logoutContext: logoutContext, isLoading: isLoading, pathBeforeLogin: pathBeforeLogin, setPathBeforeLogin: setPathBeforeLogin}}>
            {children}
        </UserContext.Provider>
    );
}
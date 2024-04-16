import { IUser } from "@/types";
import { useNavigate } from 'react-router-dom';
import {createContext, useContext, useEffect, useState} from 'react'
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async() => false as boolean,
}

type IContextType = {
    user: IUser;
    isloading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
  };

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export default function AuthProvider({ children }: { children: React.ReactNode}){
    const navigate = useNavigate();
    const [user, setuser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthUser = async () => {
        setIsLoading(true)
        try{
            const currentAccount = await getCurrentUser();
            if(currentAccount) {
                setuser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.currentAccount,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                });
                setIsAuthenticated(true);
                return true
            }
            return false
        }
        catch(error) {
            console.error(error)
            return false
        }
        finally{
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback");
        if(
            cookieFallback === "[]" ||
            cookieFallback === null ||
            cookieFallback === undefined
        ){
            navigate('/sign-in')
        }
        checkAuthUser();
    }, []);

    const value = {
        user,
        setuser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
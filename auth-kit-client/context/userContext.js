import axios from 'axios';
import { useRouter } from 'next/navigation';
import React ,{createContext, useEffect, useState, useContext} from 'react'
import toast from 'react-hot-toast';



const UserContext = React.createContext();

export const UserContextProvider = ({children})=>{
    
    const serverUrl = "http://localhost:8000";

    const router = useRouter();

    const [user, setUser] = useState({});
    const [userState, setUserState] = useState({
        name:"",
        email:"",
        password:"",
    });
    const [loading, setLoading] = useState(true);


    //register user

    const registerUser = async (e) =>{
        e.preventDefault();
        if(!userState.email.includes("@")|| !userState.password || userState.password.length<6){
           toast.error("Please enter a valid email and password (min 6 characters)");
            return;
        }
        try {
            const res = await axios.post(`${serverUrl}/api/v1/register`,userState);
            console.log("User Registered Successfully",res.data);
            toast.success("User Registered Successfully");
            console.log(res.data);
            //clear the form
            setUserState({
                name:"",
                email:"",
                password:"",
            });
            //redirect user to the login page
            router.push("/login");
        } catch (error) {
            console.log("Error registering user",error);
            toast.error(error.response.data.message);
        }
    };

    //login the user

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`,{
                email: userState.email,
                password: userState.password,
            },{
                withCredentials: true, //send cookies to the server
            });

            toast.success("User logged in successfully");

            //clear the form
            setUserState({
                email:"",
                password:"",
            });

            // push the user to dashboard page
            //redirect user to the login page
            router.push("/");
           


        } catch (error) {
            console.log("Error logging in user",error);
            toast.error(error.respone.data.message);
            
        }
    }

    //logout the user

    const logoutUser = async() => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`,{
                withCredentials: true, //send cookies to the server
            });

            toast.success("User logged out successfully");
            //redirect user to the login page
            router.push("/login");
        } catch (error) {
            console.log("Error logging out user",error);
            toast.error(error.respone.data.message);
        }
    };


    //get user logged in status

    const userLoginStatus = async() => {
        let loggedIn = false;
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login-status`,{
                withCredentials: true, //send cookies to the server
            });

            //coerce the string to boolean

            loggedIn = !!res.data;
            setLoading(false);
            if(!loggedIn){
                router.push("/login");
            }
        } catch (error) {
            console.log("Error getting user login status",error);
        }
        return loggedIn;
    };
    //dynamic form handler

    const handlerUserInput = (name) => (e)=>{
        const value = e.target.value;
        setUserState((prevState)=>({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(()=> {
        userLoginStatus();
    },[]);

    
    return(
        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
}
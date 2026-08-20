"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";


type UserName = "國王老師" | "阿寶";


type UserContextType = {

  currentUser: UserName | null;

  loading: boolean;

  login: (user: UserName) => void;

  logout: () => void;

  switchUser: (user: UserName) => void;

};


const UserContext = createContext<UserContextType | undefined>(
  undefined
);



export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [currentUser, setCurrentUser] =
    useState<UserName | null>(null);

  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    const savedUser =
      localStorage.getItem("currentUser");


    if (
      savedUser === "國王老師" ||
      savedUser === "阿寶"
    ) {

      setCurrentUser(savedUser);

    }


    setLoading(false);

  }, []);



  function login(user: UserName) {

    localStorage.setItem(
      "currentUser",
      user
    );

    setCurrentUser(user);

  }



  function logout() {

    localStorage.removeItem(
      "currentUser"
    );

    setCurrentUser(null);

  }



  function switchUser(user: UserName) {

    localStorage.setItem(
      "currentUser",
      user
    );

    setCurrentUser(user);

  }



  return (

    <UserContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        switchUser,
      }}
    >

      {children}

    </UserContext.Provider>

  );

}



export function useUser() {

  const context =
    useContext(UserContext);


  if (!context) {

    throw new Error(
      "useUser 必須在 UserProvider 裡使用"
    );

  }


  return context;

}
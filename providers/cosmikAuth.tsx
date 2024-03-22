import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  account: null,
  setAccount: (account: any) => {},
});


const AuthProvider  = ({ children }: { children: React.ReactNode } ) => {
  const [account, setAccount] = useState(null);


  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuthContext = () => {
  return useContext(AuthContext);
}

export { AuthProvider, useAuthContext };
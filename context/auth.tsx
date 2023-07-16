import React from "react";
import * as SecureStore from 'expo-secure-store';
import { SplashScreen, useRouter } from "expo-router";

import CONSTANTS from "../utils/constants";

type ApiContextType = {
  apiKey: string | null;
  baseUrl: string;
  setApiKey: (apiKey: string) => void;
}

const ApiContext = React.createContext<ApiContextType>(null as any);

export const useApiContext = () => {
  return React.useContext(ApiContext);
}

export const ApiProvider: React.FC<any> = ({ children }) => {
  const router = useRouter();

  const [ready, setReady] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  const loadApiKey = async () => {
    try {
      // await SecureStore.deleteItemAsync(CONSTANTS.SECURE_STORAGE.API_KEY)
      const key = await SecureStore.getItemAsync(CONSTANTS.SECURE_STORAGE.API_KEY)
      // const key = null;
      if (key) {
        setApiKey(key)
      } else {
        setApiKey(null)
        router.push("/auth")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setReady(true)
    }
  }

  const saveApiKey = async (apiKey: string) => {
    await SecureStore.setItemAsync(CONSTANTS.SECURE_STORAGE.API_KEY, apiKey)
    setApiKey(apiKey)
    await router.push("/")
  }

  React.useEffect(() => {
    loadApiKey()
  }, []);


  return (
    <>
      {
        !ready &&
        <SplashScreen />
      }
      <ApiContext.Provider
        value={{
          apiKey,
          setApiKey: saveApiKey,
          baseUrl: "https://plausible.io"
        }}>
        {children}
      </ApiContext.Provider>
    </>
  )
}
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TranscriptionContext = {
  url: string;
  setUrl: (index: string) => void;
  requestId: string;
  setRequestId: (index: string) => void;
  reset: () => boolean;
};

interface TranscriptionContextInterface {
  children: React.ReactNode;
}

const TranscriptionContext = createContext({} as TranscriptionContext);

const setLocalStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // catch possible errors:
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  }
};

const getLocalStorage = (key: string, initialValue: unknown) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    // if error, return initial value
    return initialValue;
  }
};

const TranscriptionContextProvider = ({
  children,
}: TranscriptionContextInterface) => {
  const [url, setUrl] = useState(getLocalStorage("url", ""));
  const [requestId, setRequestId] = useState("");

  const reset = () => {
    setUrl("");
    setRequestId("");

    return true;
  };

  useEffect(() => {
    setLocalStorage("url", url);
  }, [url]);

  return (
    <TranscriptionContext.Provider
      value={{
        url,
        setUrl,
        requestId,
        setRequestId,
        reset,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

const useTranscriptionContext = () => {
  return useContext(TranscriptionContext);
};

export { TranscriptionContextProvider, useTranscriptionContext };

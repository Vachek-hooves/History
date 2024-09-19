import {useState, useEffect, useContext, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HistoryContext = createContext({});

export const HistoryProvider = ({children}) => {
  value = {};

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export const useHistoryContext = () => {
  const historyContext = useContext(HistoryContext);
  if (!historyContext) {
    return null;
  }
  return historyContext;
};

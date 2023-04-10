import { createContext, useState } from 'react';

export const WatchListContext = createContext();

export const WatchListContextProvider = ({ children }) => {
  const [watchList, setWatchList] = useState(['GOOGL', 'MSFT', 'AMZN']);

  const addStock = (stock) => {
    if (!watchList.includes(stock)) {
      setWatchList([...watchList, stock]);
    }
  };

  const deleteStock = (stock) => {
    setWatchList(watchList.filter((el) => el !== stock));
  };

  return (
    <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
      {children}
    </WatchListContext.Provider>
  );
};

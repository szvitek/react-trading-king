import { createContext, useEffect, useState } from 'react';

const lsKey = 'watchList';

export const WatchListContext = createContext();

export const WatchListContextProvider = ({ children }) => {
  const [watchList, setWatchList] = useState(
    JSON.parse(localStorage.getItem(lsKey)) || ['GOOGL', 'MSFT', 'AMZN']
  );

  useEffect(() => {
    localStorage.setItem(lsKey, JSON.stringify(watchList));
  }, [watchList]);

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

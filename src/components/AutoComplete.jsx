import { useContext, useEffect, useState } from 'react';
import finnHub from '../apis/finnHub';
import { WatchListContext } from '../context/watchListContext';

const AutoComplete = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const { addStock } = useContext(WatchListContext);

  const renderDropdown = () => {
    const dropdownClass = search ? 'show' : null;
    return (
      <ul
        className={`dropdown-menu ${dropdownClass}`}
        style={{
          height: '500px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          cursor: 'pointer',
        }}
      >
        {results.map((result) => (
          <li
            className="dropdown-item"
            key={result.symbol}
            onClick={() => {
              addStock(result.symbol);
              setSearch('');
            }}
          >
            {result.description}({result.symbol})
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnHub.get('/search', {
          params: { q: search },
        });

        if (isMounted) {
          setResults(response.data.result);
        }
      } catch (error) {}
    };

    if (search.length > 0) {
      fetchData();
    } else {
      setResults([]);
    }

    return () => (isMounted = false);
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          id="search"
          type="text"
          className="form-control"
          placeholder="Search"
          style={{ backgroundColor: 'rgba(145, 158, 171, 0.04)' }}
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="search">Search</label>
        {renderDropdown()}
      </div>
    </div>
  );
};

export default AutoComplete;

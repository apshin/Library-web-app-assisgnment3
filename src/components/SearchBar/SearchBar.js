import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    onSearch(inputValue);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <>
    <div className='holder'>
        <header className='header-banner'>
          <form className='search-form'>
            <div className='search-form-elem'>
              <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={handleInputChange}
              />
              {query ? (
                <button className="search-clear-btn" onClick={handleClear}>
                  <FaTimes size={15} />
                </button>
              ) : (
                <button><FaSearch className='text-purple' size={15} /></button>
              )}
            </div>
          </form>
        </header>
    </div>
    </>
  );
}

export default SearchBar;

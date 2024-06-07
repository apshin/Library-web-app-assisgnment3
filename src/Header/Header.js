import React from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import LoginLogoImg from "../images/library-logo.png";
import "./Header.css";

function Header({ handleSearchQuery }) {
  return (
    <>
      <div className="header d-flex">
        <div className="logo">
          <img src={LoginLogoImg} alt="logo" className="logo" />
        </div>
        <div className="search-bar">
          <SearchBar onSearch={handleSearchQuery} />
        </div>
      </div>
    </>
  );
}

export default Header;

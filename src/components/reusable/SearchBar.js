import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react";

const cssStyles = {
  form: {
    height: "3rem",
    display: "flex",
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
    padding: "0 1.6875rem",
    position: "relative",
    transition: "border-radius 0.5s ease, border-color 0.3s ease",
    border: "1px solid #d1d5db", 
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    borderRadius: "30px",
    borderColor: "#d1d5db",
    margin: "0px 0px 30px 0px"
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "inherit"
  },
  button: {
    border: "none",
    background: "none",
    cursor: "pointer"
  },
  icon: {
    color: "#9ca3af"
  },
  formFocusWithin: {
    borderRadius: "10px",
    borderColor: "rgba(144,150,156,0.7)",
  },
  formBlur: {
    borderRadius: "30px"
  }
};

const SearchBar = ({ handleSearch, searchPlaceholder, category }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/list/${category}?q=${searchQuery}&page=1`);
    handleSearch(searchQuery);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={cssStyles.form}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, cssStyles.formFocusWithin);
      }}
      onBlur={(e) => {
        Object.assign(e.currentTarget.style, cssStyles.formBlur);
        e.currentTarget.style.borderColor = cssStyles.form.borderColor; 
      }}
    >
      <input
        type="text"
        name="search"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={onChange}
        style={cssStyles.input}
      />
      <button
        type="submit"
        style={cssStyles.button}
        aria-label="Search"
      >
        <Search style={cssStyles.icon} />
      </button>
    </form>
  );
};

const SearchComponent = ({ handleSearch, placeholder = "Search...", category }) => {
  return (
    <SearchBar handleSearch={handleSearch} searchPlaceholder={placeholder} category={category} />
  );
};

export default SearchComponent;

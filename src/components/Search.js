import React, { useState, useRef, useEffect } from "react";
import Suggestions from "./Suggestions";

const MySearchForm = ({ performPhotoSearch }) => {
  const popularSearches = [
    "Beach",
    "Sunset",
    "Food",
    "Travel",
    "Technology",
    "Animals"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef();

  const handleFormSubmission = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      performPhotoSearch(searchQuery);
      setSearchQuery("");
      setSearchSuggestions("");
      setShowSearchSuggestions(false);
    }
  };

  const retrieveSuggestions = () => {
    fetch(`https://api.datafetch.com/suggestions?s=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const suggArray = data;
        setSearchSuggestions({
          suggestions: suggArray
        });
      });
  };

  const handleInputChange = (e) => {
    let query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      retrieveSuggestions(query);
    }
  };

  const handleInputClick = () => {
    setShowSearchSuggestions(true);
  };

  const handleSuggestionClick = (e) => {
    performPhotoSearch(e);
    setSearchQuery("");
    setSearchSuggestions("");
    setShowSearchSuggestions(false);
  };

  const handleOuterClick = (e) => {
    if (searchRef.current.contains(e.target)) {
      return;
    }
    setShowSearchSuggestions(false);
  };

  useEffect(() => {
    if (showSearchSuggestions) {
      document.addEventListener("mousedown", handleOuterClick);
    } else {
      document.removeEventListener("mousedown", handleOuterClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOuterClick);
    };
  }, [showSearchSuggestions]);

  return (
    <form ref={searchRef} onSubmit={handleFormSubmission} className="my-form__search">
      <span className="search__icon">
        <svg
          width="20"
          height="20"
          version="1.1"
          viewBox="0 0 25 25"
          aria-hidden="false"
        >
          <path d="M22 20c1.2-1.6 2-3.7 2-6 0-5.5-4.5-10-10-10S4 8.5 4 14s4.5 10 10 10c2.3 0 4.3-.7 6-2l6.1 6 1.9-2-6-6zm-8 1.3c-4 0-7.3-3.3-7.3-7.3S10 6.7 14 6.7s7.3 3.3 7.3 7.3-3.3 7.3-7.3 7.3z"></path>
        </svg>
      </span>
      <input
        id="searchQuery"
        className="search__input"
        type="text"
        placeholder="Browse free high-res images"
        onChange={handleInputChange}
        onClick={(e) => handleInputClick(!showSearchSuggestions)}
        value={searchQuery}
      />
      {showSearchSuggestions ? (
        <Suggestions
          suggestions={searchSuggestions}
          onClick={(e) => handleSuggestionClick(e)}
        />
      ) : (
        <div className="search__tags">
          {popularSearches.map((suggestion, index) => {
            return (
              <span
                key={index}
                className="tag"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </span>
            );
          })}
        </div>
      )}
    </form>
  );
};

export default Form;

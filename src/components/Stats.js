import React from "react";
import CountUp from "react-countup";

const Sentence = ({ resultCount, searchQuery }) => {
  return (
    <>
      <div className="my-stats">
        <svg
          width="32"
          height="32"
          className="_1Ig-9"
          version="1.1"
          viewBox="0 0 32 32"
          aria-hidden="false"
        >
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
        </svg>
        {resultCount === 0 ? (
          <p>
            Apologies, no matching results found for <b className="my-query">{searchQuery}</b>. Please try again!
          </p>
        ) : (
          <p>
            Currently displaying
            <strong> {resultCount && <CountUp end={resultCount} />} </strong>
            results for:
            <strong> {searchQuery} </strong>
          </p>
        )}
      </div>
    </>
  );
};

export default Sentence;

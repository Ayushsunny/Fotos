import React, { useState, useEffect, Suspense, lazy } from "react";
import { unsplash } from "./api";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollToTop from "react-scroll-to-top";

import "./App.scss";

import Spinner from "./components/Spinner";
import HeaderText from "./components/HeaderText";
import SearchForm from "./components/SearchForm";
import Stats from "./components/Stats";
const Photos = lazy(() => import("./components/Photos"));

const App = () => {
  const [query, setQuery] = useState("Nature");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");
  const perPage = 12;

  const onSearchPhoto = (searchTerms) => {
    setQuery(searchTerms);
    setLoading(true);
    setPhotos([]);
  };

  const getMorePhotos = async (page) => {
    try {
      const response = await unsplash.search.getPhotos({
        query: query,
        page: page,
        per_page: perPage,
      });

      setTotal(response.response.total);
      setPage(page);

      const newPhotos = response.response.results;

      if (photos.length > 0) {
        setPhotos([...photos, ...newPhotos]);
      } else {
        setPhotos(newPhotos);
      }
    } catch (err) {
      console.log("Unable to retrieve the Fotos. Reason: " + err);
    }
  };

  useEffect(() => {
    setPage(1);
    getMorePhotos(1);
  }, [query]);

  return (
    <div className="app">
      <div className="header">
        <div
          className="header__background"
          style={{
            backgroundImage: photos.length ? `url(${photos[0].urls.regular})` : "",
          }}
        ></div>
        <div className="header__form">
          <HeaderText />
          <SearchForm onSearchPhoto={onSearchPhoto} />
        </div>
      </div>
      <Stats stats={total} query={query} />
      <Suspense fallback={<Spinner />}>
        <div className="gallery">
          <InfiniteScroll
            dataLength={photos.length}
            next={() => getMorePhotos(page + 1)}
            hasMore={isLoading}
          >
            {isLoading ? (
              <>
                <Photos photos={photos.slice(1)} />
                {photos.length === total && total !== 0 ? (
                  <div className="end__text">Yay! You have seen it all...</div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </InfiniteScroll>
        </div>
      </Suspense>
      <ScrollToTop smooth viewBox="0 0 24 24" svgPath="M18 15l-6-6-6 6" />
    </div>
  );
};

export default App;

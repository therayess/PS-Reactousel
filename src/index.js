import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Carousel from './Carousel';
import { useMediaQuery } from 'react-responsive';
import { getImages } from './api';
import "./styles.css";

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const images = await getImages("BMW M3");
        setImages(images.hits.slice(0, 6));
      } catch(e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main>
      <header>
        <h1 className="site-heading">
          PS Reactousel
          <small>By: Ammar Rayess</small>
        </h1>
      </header>

      {loading ?
        <div className="loader">Loading ..</div>
      : 
        <Fragment>
          {isMobile ?
            <Carousel
              images={images}
              imgsPerView={1}
              infinite={true}
              overlayedNav={true}
            />
          :
            <Carousel 
              images={images}
              imgsPerView={3}
              infinite={false}
              overlayedNav={false}
            />
          }
        </Fragment>
      }
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

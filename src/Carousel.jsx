import React, { useState, useRef } from "react";
import Arrow from "./static/arrow.svg";
import { useEvent } from './hooks';

/*
Options are:
  imgsPerView: how many to show in the viewport at one time,
  infinite: whether slider should keep looping through images or not,
  overlayedNav: if true, sets the style of nav buttons to be inside the carousel, else, it'll be under it
*/
const Carousel = ({
  images = [],
  imgsPerView = 1,
  infinite = true,
  overlayedNav = false
}) => {
  // A ref to the slider wrapper element, to be used to do the sliding
  const sliderWrapperEl = useRef(null);

  // We keep currently active slide index in state to be used for sliding
  // next and prev
  const [currentIndex, setCurrentIndex] = useState(0);

  // Attach key press events for arrow left and right for easier
  // navigation, using a custom hook "useEvent" for better event handling
  useEvent('keydown', event => {
    const { keyCode } = event;

    if (keyCode === 37) {
      goPrev();
    }

    if (keyCode === 39) {
      goNext();
    }
  });

  // in goPrev and goNext, we basically calculate our prev/next slide's index
  // taking into consideration whether the slider is in infinite mode or not,
  // if yes, when on the last slide, next will return you back to first slide,
  // likewise for prev, if not, slider will stop at the last slide
  const goPrev = () => {
    const index =
      currentIndex <= 0
        ? infinite
          ? images.length - imgsPerView
          : 0
        : currentIndex - 1;
    goToSlide(index);
  };

  const goNext = () => {
    const index =
      currentIndex >= images.length - imgsPerView
        ? infinite
          ? 0
          : currentIndex
        : currentIndex + 1;
    goToSlide(index);
  };

  // Using index, we pick the slide element we wanna slide to, calculate
  // it's position from the start of the slider (leftmost part basically),
  // then we update the wrapper transform with that position, which will 
  // trigger the sliding effect
  const goToSlide = index => {
    const slideToEl = document.querySelectorAll(".slider__img")[index];
    const pos = slideToEl.getBoundingClientRect().width * index * -1;

    sliderWrapperEl.current.style = `transform: translateX(
      ${pos}px
    );`;

    setCurrentIndex(index);
  };

  return (
    <div className="slider">
      <div ref={sliderWrapperEl} className="slider__wrapper">
        {images.map((img, index) => (
          <img
            key={index}
            className={`slider__img${index === currentIndex ? ' active' : ''}`}
            src={img.largeImageURL}
            alt={img.tags}
          />
        ))}
      </div>
      <div
        className={`sliderNav${overlayedNav ? " sliderNav--overlayed" : ""}`}
      >
        <button
          onClick={goPrev}
          className="sliderNav__btn sliderNav__btn--prev"
        >
          {overlayedNav ? <i className="icon icon--arrow-left" /> : "prev"}
        </button>
        <button
          onClick={goNext}
          className="sliderNav__btn sliderNav__btn--next"
        >
          {overlayedNav ? <i className="icon icon--arrow-right" /> : "next"}
        </button>
      </div>
      <style>{`
        .slider {
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .slider__wrapper {
          display: flex;
          transform: translateX(0);
          transition: transform 0.5s cubic-bezier(0.59, -0.37, 0.39, 1.325);
        }
        .slider__img {
          width: calc(100% / ${imgsPerView});
          height: auto;
          object-fit: cover;
          padding: 30px 15px;
          background-color: #000;
        }
        .sliderNav {
          margin-top: 20px;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
        .sliderNav--overlayed {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sliderNav__btn {
          margin: 0 2px;
          border-radius: 40px;
          background: #ec4d65;
          border: unset;
          color: #fff;
          font-weight: bold;
          text-transform: capitalize;
          padding: 15px 30px;
          outline: none;
          cursor: pointer;
          transition: background 0.3s;
        }
        .sliderNav__btn:hover {
          background: #e26578;
        }
        .sliderNav__btn--prev {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .sliderNav__btn--next {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .sliderNav--overlayed .sliderNav__btn {
          background: rgba(255, 255, 255, 0.5);
          width: 100px;
          height: 100px;
          border-radius: 100px;
          padding: 0;
          display: flex;
        }
        .sliderNav--overlayed .sliderNav__btn:hover {
          background: rgba(255, 255, 255, 0.7);
        }
        .sliderNav--overlayed .sliderNav__btn--prev {
          padding-right: 20px;
          justify-content: flex-end;
          transform: translateX(-50%);
        }
        .sliderNav--overlayed .sliderNav__btn--next {
          padding-left: 20px;
          justify-content: flex-start;
          transform: translateX(50%);
        }
        .icon--arrow-left {
          width: 38px; 
          height: 63px;
          display: inline-block;
          background: url(${Arrow}) no-repeat 0 0;
          transform: scaleX(-1);
        }
        .icon--arrow-right {
          width: 38px; 
          height: 63px;
          display: inline-block;
          background: url(${Arrow}) no-repeat 0 0;
        }
      `}</style>
    </div>
  );
}

export default Carousel;

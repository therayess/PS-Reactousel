import React from 'react';
import ReactDOM from 'react-dom';
import { act } from "react-dom/test-utils";
import Carousel from '../Carousel';
import { getImages } from '../api';

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("Carousel", () => {
	// Fetch images and make sure carousel is rendered properly
  test("it fetches images from api and loads properly", async () => {
		const res = await getImages();
		const images = res.hits;
		act(() => {
      ReactDOM.render(<Carousel images={images} />, container);
    });
  });

  // Fetch images, load carousel and test the Next slide action
  test("switch to second image when next button is clicked", async () => {
		const res = await getImages();
		const images = res.hits;
		act(() => {
      ReactDOM.render(<Carousel images={images} />, container);
    });
    const button = container.getElementsByTagName("button")[1];
    expect(button.textContent).toBe("next");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const activeSlide = container.querySelector('.active');
    expect(activeSlide.src).toBe(images[1].largeImageURL);
  });

  // Fetch images, load carousel and test the Prev slide action,
  // carousel should slide to the last image since infinite is true by default 
  test("switch to last image when previous button is clicked", async () => {
		const res = await getImages();
		const images = res.hits;
		act(() => {
      ReactDOM.render(<Carousel images={images} />, container);
    });
    const button = container.getElementsByTagName("button")[0];
    expect(button.textContent).toBe("prev");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const activeSlide = container.querySelector('.active');
    expect(activeSlide.src).toBe(images[images.length - 1].largeImageURL);
  });
});

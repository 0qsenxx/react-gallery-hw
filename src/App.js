import "./App.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Button from "./components/Button/Button";
import Loader from "./components/Loader/Loader";
import Modal from "./components/Modal/Modal";

const App = () => {
  const [images, setImages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [modalImgSrc, setModalImgSrc] = useState("");
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [ableToLoadMore, setAbleToLoadMore] = useState(true);
  // const [totalHits, setTotalHits] = useState(0);
  const [nothingFound, setNothingFound] = useState(false);
  // const [loading, setLoading] = useState(false);

  const getImagesByInput = (evt) => {
    evt.preventDefault();
    const newInputValue = evt.target.elements.searchbarInput.value.trim();
    if (newInputValue !== inputValue) {
      setInputValue(newInputValue);
      setPage(1);
      setImages([]);
      setNothingFound(false);
      setAbleToLoadMore(true);
      // setLoading(true);
    }
    evt.target.reset();
  };

  useEffect(() => {
    if (!inputValue) return;

    fetch(
      `https://pixabay.com/api/?q=${inputValue}&page=${page}&key=43032297-bb179a9d38920a1e0de24f77d&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.hits.length === 0) {
          setNothingFound(true);
        } else {
          setNothingFound(false);
          setImages((prevImages) => prevImages.concat(data.hits));
          setAbleToLoadMore(data.hits.length < data.totalHits);
        }
      });
  }, [inputValue, page]);

  const loadMoreFn = useCallback(() => {
    if (ableToLoadMore) {
      // setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  const getImgSrcForModal = useCallback(
    (evt) => {
      const imgSrc = evt.target.src;
      const modalImgIdx = images.findIndex(
        (image) => image.largeImageURL === imgSrc
      );
      setModalImgSrc(imgSrc);
      setModalImgIdx(modalImgIdx);
    },
    [images]
  );

  const closeModal = () => {
    setModalImgSrc("");
  };

  const switchKeys = useMemo(
    () => (evt) => {
      if (evt.key === "Escape") {
        closeModal();
      } else if (evt.key === "ArrowLeft") {
        setModalImgIdx((prevIdx) =>
          prevIdx === 0 ? images.length - 1 : prevIdx - 1
        );
      } else if (evt.key === "ArrowRight") {
        setModalImgIdx((prevIdx) =>
          prevIdx === images.length - 1 ? 0 : prevIdx + 1
        );
      }
    },
    [images.length]
  );

  useEffect(() => {
    if (modalImgSrc) {
      window.addEventListener("keydown", switchKeys);
      return () => window.removeEventListener("keydown", switchKeys);
    }
  }, [modalImgSrc]);

  useEffect(() => {
    if (images.length > 0 && modalImgSrc) {
      setModalImgSrc(images[modalImgIdx]?.largeImageURL);
    }
  }, [modalImgIdx, images, modalImgSrc]);

  return (
    <>
      <Searchbar getImagesByInput={getImagesByInput} />
      {nothingFound && (
        <h2 className="NothingFoundTitle">
          Нажаль, за Вашим запитом нічого не знайдено
        </h2>
      )}
      <ImageGallery images={images} getImgSrcForModal={getImgSrcForModal} />
      {images.length === 0 && <Loader />}
      {images.length !== 0 && ableToLoadMore && (
        <Button loadMoreFn={loadMoreFn} />
      )}
      {modalImgSrc && <Modal imgSrc={modalImgSrc} closeModal={closeModal} />}
    </>
  );
};

export default App;

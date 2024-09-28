import "./App.css";
import { Component } from "react";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Button from "./components/Button/Button";
import Loader from "./components/Loader/Loader";
import Modal from "./components/Modal/Modal";

// let i = 0;

class App extends Component {
  state = {
    images: [],
    inputValue: "",
    page: 1,
    modalImgSrc: "",
    modalImgIdx: 0,
    ableToLoadMore: true,
    totalHits: 0,
    nothingFound: false,
  };

  getImagesByInput = (evt) => {
    evt.preventDefault();
    const inputValue = evt.target.elements.searchbarInput.value;
    this.setState({ page: 1, totalHits: 0 });
    fetch(
      `https://pixabay.com/api/?q=${evt.target.elements.searchbarInput.value}&page=1&key=43032297-bb179a9d38920a1e0de24f77d&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.hits.length === 0) {
          this.setState({ nothingFound: true });
        }
        this.setState({
          images: data.hits,
          inputValue,
          totalHits: data.totalHits,
          ableToLoadMore: data.hits.length < data.totalHits,
        });
      });
    evt.target.reset();
  };

  loadMoreFn = () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      () => {
        fetch(
          `https://pixabay.com/api/?q=${this.state.inputValue}&page=${this.state.page}&key=43032297-bb179a9d38920a1e0de24f77d&image_type=photo&orientation=horizontal&per_page=12`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.hits.length !== 0) {
              this.setState((prevState) => ({
                images: prevState.images.concat(data.hits),
                ableToLoadMore:
                  prevState.images.length + data.hits.length <
                  this.state.totalHits,
              }));
            } else {
              this.setState({ ableToLoadMore: false });
            }
          });
      }
    );
  };

  getImgSrcForModal = (evt) => {
    const imgSrc = evt.target.src;
    const modalImgIdx = this.state.images.findIndex(
      (image) => image.largeImageURL === imgSrc
    );
    this.setState({ modalImgSrc: imgSrc, modalImgIdx });
    window.addEventListener("keydown", this.switchKeys);
  };

  closeModal = () => {
    this.setState({ modalImgSrc: "" });
    window.removeEventListener("keydown", this.handleKeyDown);
  };

  switchKeys = (evt) => {
    if (evt.key === "Escape") {
      this.closeModal();
    } else if (evt.key === "ArrowLeft") {
      this.setState((prevState) => {
        const prevIdx =
          prevState.modalImgIdx === 0
            ? prevState.images.length - 1
            : prevState.modalImgIdx - 1;
        return {
          modalImgIdx: prevIdx,
          modalImgSrc: prevState.images[prevIdx].largeImageURL,
        };
      });
    } else if (evt.key === "ArrowRight") {
      this.setState((prevState) => {
        const nextIdx =
          prevState.modalImgIdx === prevState.images.length - 1
            ? 0
            : prevState.modalImgIdx + 1;
        return {
          modalImgIdx: nextIdx,
          modalImgSrc: prevState.images[nextIdx].largeImageURL,
        };
      });
    }
  };

  render() {
    return (
      <>
        <Searchbar getImagesByInput={this.getImagesByInput} />
        {this.state.nothingFound && (
          <h2 className="NothingFoundTitle">
            Нажаль, за Вашим запитом нічого не знайдено
          </h2>
        )}
        <ImageGallery
          images={this.state.images}
          getImgSrcForModal={this.getImgSrcForModal}
        />
        {this.state.images.length === 0 && <Loader />}
        {this.state.images.length !== 0 && this.state.ableToLoadMore && (
          <Button loadMoreFn={this.loadMoreFn} />
        )}
        {this.state.modalImgSrc.length !== 0 && (
          <Modal
            imgSrc={this.state.modalImgSrc}
            closeModal={this.closeModal}
            switchKeys={this.switchKeys}
          />
        )}
        {/* {console.log(this.state.startImages)}; */}
      </>
    );
  }
}

export default App;

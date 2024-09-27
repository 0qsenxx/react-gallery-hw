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
  };

  getImagesByInput = (evt) => {
    evt.preventDefault();
    this.setState({ page: 1 });
    fetch(
      `https://pixabay.com/api/?q=${evt.target.elements.searchbarInput.value}&page=1&key=43032297-bb179a9d38920a1e0de24f77d&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          images: data.hits,
          inputValue: evt.target.elements.searchbarInput.value,
        });
      });
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
            this.setState((prevState) => ({
              images: prevState.images.concat(data.hits),
            }));
          });
      }
    );
  };

  getImgSrcForModal = (evt) => {
    const imgSrc = evt.target.src;
    this.setState({ modalImgSrc: imgSrc });
    window.addEventListener("keydown", this.closeModalByEsc);
  };

  closeModal = () => {
    this.setState({ modalImgSrc: "" });
    window.removeEventListener("keydown", this.handleKeyDown);
  };

  closeModalByEsc = (evt) => {
    if (evt.key === "Escape") {
      this.closeModal();
    }
  };

  render() {
    return (
      <>
        <Searchbar getImagesByInput={this.getImagesByInput} />
        <ImageGallery
          images={this.state.images}
          getImgSrcForModal={this.getImgSrcForModal}
        />
        {this.state.images.length === 0 && <Loader />}
        {this.state.images.length !== 0 && (
          <Button loadMoreFn={this.loadMoreFn} />
        )}
        {this.state.modalImgSrc.length !== 0 && (
          <Modal
            imgSrc={this.state.modalImgSrc}
            closeModal={this.closeModal}
            closeModalByEsc={this.closeModalByEsc}
          />
        )}
        {/* {console.log(this.state.startImages)}; */}
      </>
    );
  }
}

export default App;

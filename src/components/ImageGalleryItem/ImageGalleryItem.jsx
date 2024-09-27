const ImageGalleryItem = ({ imgSrc, getImgSrcForModal }) => (
  <li className="ImageGalleryItem">
    <img
      src={imgSrc}
      alt="hello"
      className="ImageGalleryItem-image"
      onClick={getImgSrcForModal}
    />
  </li>
);

export default ImageGalleryItem;

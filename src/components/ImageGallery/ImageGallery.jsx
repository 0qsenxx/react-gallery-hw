import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import { nanoid } from "nanoid";

const ImageGallery = ({ images, getImgSrcForModal }) => (
  <ul className="ImageGallery">
    {images.map((image) => (
      <ImageGalleryItem
        imgSrc={image.largeImageURL}
        key={nanoid()}
        getImgSrcForModal={getImgSrcForModal}
      />
    ))}
  </ul>
);

export default ImageGallery;

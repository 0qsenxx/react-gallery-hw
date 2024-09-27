const Modal = ({ imgSrc, closeModal, closeModalByEsc }) => {
  const overlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="Overlay" onClick={overlayClick}>
      <div className="Modal">
        <img src={imgSrc} alt="" />
      </div>
    </div>
  );
};

export default Modal;

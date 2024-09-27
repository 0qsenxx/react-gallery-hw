const Searchbar = ({ getImagesByInput }) => (
  <header className="Searchbar">
    <form className="SearchForm" onSubmit={getImagesByInput}>
      <input
        className="SearchForm-input"
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
        name="searchbarInput"
      />
      <button type="submit" className="SearchForm-button">
        <span className="SearchForm-button-label">search</span>
      </button>
    </form>
  </header>
);

export default Searchbar;

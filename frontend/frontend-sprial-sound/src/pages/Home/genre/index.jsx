export default function GenreFilter() {
  return (
    <section className="genre-select-container">
      <label htmlFor="genre-select">View by genre</label>
      <select id="genre-select">
        <option value="">Show All</option>
      </select>
    </section>
  );
}

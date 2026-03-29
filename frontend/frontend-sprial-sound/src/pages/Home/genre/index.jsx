import styles from './genre.module.css';
export default function GenreFilter() {
  return (
    <section className={styles['genre-select-container']}>
      <label htmlFor="genre-select">View by genre</label>
      <select id="genre-select">
        <option value="">Show All</option>
      </select>
    </section>
  );
}

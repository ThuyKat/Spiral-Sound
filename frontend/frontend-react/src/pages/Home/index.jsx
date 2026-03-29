import ProductList from './productlist';
import GenreFilter from './genre';

export default function Home() {
  return (
    <>
      <GenreFilter />
      <ProductList />
    </>
  );
}

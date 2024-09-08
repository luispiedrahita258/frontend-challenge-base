import Movies from './Movies';

export default function Home(): JSX.Element {
  return (
    <div>
      {/* <h1>Popular Movies</h1> */}
      <Movies /> {/* Renderiza las películas solo en la página principal */}
    </div>
  );
}

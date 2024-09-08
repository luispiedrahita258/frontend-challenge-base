import Movies from './Movies';

export default function homePage() {
  return (
    <div>
      {/* <h1>Popular Movies</h1> */}
      <Movies /> {/* Renderiza las películas solo en la página principal */}
    </div>
  );
}

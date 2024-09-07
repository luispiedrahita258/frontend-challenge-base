import Movies from './Movies'; // Importa el componente Movies

export default function Home() {
  return (
    <div>
      {/* <h1>Popular Movies</h1> */}
      <Movies /> {/* Renderiza las películas solo en la página principal */}
    </div>
  );
}

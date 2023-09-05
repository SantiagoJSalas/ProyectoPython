import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Hola</h1>
      <button onClick={() => navigate('/')}>Ir a destino</button>
    </>
  );
}

export default Main;

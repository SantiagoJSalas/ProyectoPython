import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const navigate = useNavigate();
    return(
        <>
        <h1>Hola</h1>
        <button onClick={() => navigate('/main')}>Ir a destino</button>
        </>
    );
}
export default Login;
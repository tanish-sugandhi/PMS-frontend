import { useSelector } from 'react-redux';

const useToken = () => {
  const reduxToken = useSelector(state => state.token.value);
  console.log("useToken method : "+reduxToken);
  return reduxToken;
}

export default useToken;
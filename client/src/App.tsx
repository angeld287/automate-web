import React, { useEffect } from 'react';
import './App.css';
import 'antd/dist/reset.css';
import Routes from './Routes';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUserSession } from './features/userSession/userSessionSlice';
import { getSessionAsync } from './features/userSession/asyncThunks';
import CustomLoader from './Components/CustomLoader';
import { ToastContainer } from 'react-toastify';

function App() {
  const { getSessionStatus, activeSession } = useAppSelector(selectUserSession);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSessionAsync());
    return () => {}
  }, []);
  
  if (getSessionStatus === 'pending') return <CustomLoader />

  return (
    <div className="App">
      <Routes {...{activeSession}}/>
      <ToastContainer/>
    </div>
  );
}

export default App;

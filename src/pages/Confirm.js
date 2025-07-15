import React, { useEffect, useState, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Confirm = () => {
  const { token } = useParams();
  const [msg, setMsg] = useState('Confirming...');
  const called = useRef(false); 
  const navigate = useNavigate();
  const host_uri = 'http://34.229.222.57:5000';

  useEffect(() => {
	if (called.current) return; // prevents reruns
    called.current = true;  
	
      const confirm = async () => {
      try {
        const res = await axios.get(host_uri+`/api/confirm/${token}`);
        setMsg(res.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setMsg(err.response?.data?.message || 'Invalid or expired token.');
      }
    };

    confirm();
	  
  }, [token, navigate]);

  return <div style={{ textAlign: 'center', marginTop: '50px' }}>{msg}</div>;
};

export default Confirm;

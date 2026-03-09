import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
const LoginPage = () => {

  const [email, setEmail] = useState('alex@timetoprogram.com');
  const [password, setPassword] = useState('test123');
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const {login} = useAuth();
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const {token, user} = await authService.login(email, password);
      login(user, token);
      toast.success("Login successful!");
      navigate('/dashboard');
    }
    catch(error){
      setError(error.message || 'Failed to login, please check credentials');
      toast.error(error.message || 'failed to login.');
    }
    finally{
      setLoading(false);
    }

  return (
    <div>
      <div className=''>
        <div className=''/>
        <div className=''>
          <div className=''>
            {/*header*/}
            <div className=''>
              <div className=''>
                <BrainCircuit className='' strokeWidth={2}/>
              </div>
              <h1>Welcome back</h1>
            </div>
            <p>Sign in to continue your journey</p>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="">
        {/* email field */}
        <div className="">
          <label className=''>
            Email
          </label>
          <div className="">
            
          </div>
        </div>
      </div>
     
    </div>
  )};
}

export default LoginPage;

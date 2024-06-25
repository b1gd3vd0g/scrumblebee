import '../css/create_acct.css';
import scrumblebee from '../img/scrumblebee_icon_trans.png';
import {
  validateEmail,
  validatePassword,
  validateUsername
} from '../funcs/validators';
import { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestCreateAcct } from '../funcs/requests';

const CreationContext = createContext();

const CreateAcct = () => {
  const [creation, setCreation] = useState({});
  console.log(creation);

  useEffect(() => {
    if (creation.send) {
      const un = creation.username;
      const pw = creation.password;
      const em = creation.email;
      (async () => {
        const result = await requestCreateAcct(un, em, pw);
        if (!result.success)
          setCreation({
            ...creation,
            send: false,
            feedback: result.message
          });
        else
          setCreation({
            ...creation,
            success: result.success,
            feedback: result.message
          });
      })();
    }
  }, [creation.send]);

  const initialCreationContext = { creation, setCreation };
  return (
    <div className='CreateAcct'>
      <CreationContext.Provider value={initialCreationContext}>
        <img src={scrumblebee} />
        <h1>Create a new account</h1>
        <FormGroup
          id='username'
          label='Username'
          validator={validateUsername}
        />
        <FormGroup
          id='password'
          label='Password'
          type='password'
          validator={validatePassword}
        />
        <FormGroup
          id='email'
          label='Email address'
          type='email'
          validator={validateEmail}
        />
        <CreateAcctBtn />
        <span>{creation.feedback}</span>
      </CreationContext.Provider>
    </div>
  );
};

const FormGroup = ({ id, label, type = 'text', validator = (i) => true }) => {
  const { creation, setCreation } = useContext(CreationContext);

  const validate = () => {
    const element = document.querySelector(`#${id}`);
    const input = element.value.trim();
    const valid = validator(input);
    if (valid) {
      element.classList.remove('invalid');
      setCreation({
        ...creation,
        [id]: input
      });
    } else {
      element.classList.add('invalid');
      setCreation({
        ...creation,
        [id]: undefined
      });
    }
  };

  return (
    <div className='FormGroup'>
      <label>{label}</label>
      <input id={id} type={type} onBlur={validate} />
    </div>
  );
};

const CreateAcctBtn = () => {
  const { creation, setCreation } = useContext(CreationContext);
  const disabled =
    !(creation.username && creation.password && creation.email) ||
    creation.send;

  const attemptCreation = async (evt) => {
    evt.preventDefault();
    setCreation({ ...creation, send: true });
  };

  return (
    <>
      <button disabled={disabled} onClick={attemptCreation}>
        Create Account
      </button>
      <Link to='/'>
        <button>Back to welcome</button>
      </Link>
    </>
  );
};

export default CreateAcct;

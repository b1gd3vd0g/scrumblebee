const CreateAcct = () => {
  return (
    <div className='CreateAcct'>
      <h1>Create a new account</h1>
      <FormGroup id='username' label='Username' />
      <FormGroup id='password' label='Password' type='password' />
      <FormGroup id='email' label='Email address' type='email' />
      <CreateAcctBtn />
    </div>
  );
};

const FormGroup = ({ id, label, type = 'text' }) => {
  return (
    <div className='FormGroup'>
      <label>{label}</label>
      <input id={id} type={type} />
    </div>
  );
};

const CreateAcctBtn = () => {
  const createAcct = async () => {};

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        createAcct();
      }}>
      Create Account
    </button>
  );
};

export default CreateAcct;

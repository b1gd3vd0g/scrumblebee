import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <>
      <p>Welcome to Scrumblebee!</p>
      <Link to='/sign_in'>
        <button>Sign in</button>
      </Link>
      <Link to='/create_acc'>
        <button>Create account</button>
      </Link>
    </>
  );
};

export default WelcomePage;

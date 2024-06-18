import { Link } from 'react-router-dom';
import scrumblebee from '../img/scrumblebee_icon_trans.png';
import '../css/welcome_page.css';
const WelcomePage = () => {
  return (
    <div className='WelcomePage'>
      <img src={scrumblebee} />
      <h1>Welcome to Scrumblebee</h1>
      <Link to='/sign_in'>
        <button>Sign in</button>
      </Link>
      <Link to='/create_acc'>
        <button>Create account</button>
      </Link>
    </div>
  );
};

export default WelcomePage;

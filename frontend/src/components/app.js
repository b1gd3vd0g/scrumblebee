import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './welcome_page';
import CreateAcct from './create_acct';
import SignIn from './sign_in';
import FourOhFour from './four_oh_four';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/create_acc' element={<CreateAcct />} />
        <Route path='/sign_in' element={<SignIn />} />
        <Route path='*' element={<FourOhFour />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

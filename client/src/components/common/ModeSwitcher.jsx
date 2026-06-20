import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeContext } from '../../context/ModeContext';

const ModeSwitcher = () => {
  const { isSellerMode, setMode } = useContext(ModeContext);
  const navigate = useNavigate();

  const handleSwitch = (mode) => {
    setMode(mode);
    if (mode === 'seller') {
      navigate('/provider/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center bg-gig-teal rounded-full p-0.5 w-32 sm:w-36 h-9 cursor-pointer select-none">
      <div
        className={`absolute top-0.5 bottom-0.5 w-1/2 rounded-full bg-white/25 transition-transform duration-300 ease-in-out ${
          isSellerMode ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        onClick={() => handleSwitch('buyer')}
        className={`relative z-10 w-1/2 text-center text-xs sm:text-sm font-semibold py-1.5 transition-colors duration-200 ${
          !isSellerMode ? 'text-white' : 'text-white/60'
        }`}
      >
        Buyer
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('seller')}
        className={`relative z-10 w-1/2 text-center text-xs sm:text-sm font-semibold py-1.5 transition-colors duration-200 ${
          isSellerMode ? 'text-white' : 'text-white/60'
        }`}
      >
        Seller
      </button>
    </div>
  );
};

export default ModeSwitcher;

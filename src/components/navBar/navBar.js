import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiBell,
  FiHelpCircle,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiTarget,
} from 'react-icons/fi';
import './navBarStyle.css';

const CURRENT_PAGE_KEY = 'currentPage';

const navItems = [
  { key: 'ratings', label: 'Ratings', path: '/ratings', icon: FiBarChart2 },
  { key: 'contests', label: 'Contests', path: '/contests', icon: FiBell },
  { key: 'userComparator', label: 'User Comparator', path: '/user-comparator', icon: FiUsers },
  { key: 'problemRecommendation', label: 'Problem Recommendation', path: '/problem-recommendation', icon: FiTarget },
  { key: 'aiRoadmap', label: 'AI CP Roadmap', path: '/ai-roadmap', icon: FiTarget },
  { key: 'help', label: 'Help', path: '/help', icon: FiHelpCircle },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token') || localStorage.getItem('username')));
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const activePath = useMemo(() => location.pathname || '/ratings', [location.pathname]);

  useEffect(() => {
    localStorage.setItem(CURRENT_PAGE_KEY, activePath);
    setIsLoggedIn(Boolean(localStorage.getItem('token') || localStorage.getItem('username')));
  }, [activePath]);

  const getUserOpname = () => {
    const raw = localStorage.getItem('username');
    if (!raw) return 'Profile';

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed === 'object') return parsed.username || parsed.opusername || 'Profile';
      return 'Profile';
    } catch (error) {
      return raw;
    }
  };

  const handleNavigate = (path) => {
    localStorage.setItem(CURRENT_PAGE_KEY, path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutDialog(false);
    navigate('/ratings');
  };

  return (
    <header className='nav-bar'>
      <nav className='nav-bar__section nav-bar__section--left' aria-label='Main navigation'>
        <button
          type='button'
          className='nav-brand'
          onClick={() => handleNavigate('/ratings')}
          aria-label='Go to ratings'
        >
          <span className='nav-brand__text'>OneProfile</span>
        </button>

        {navItems.map(({ key, label, path, icon: Icon }) => (
          <button
            key={key}
            type='button'
            className={`Nav-tag ${activePath === path ? 'active' : ''}`}
            onClick={() => handleNavigate(path)}
            aria-current={activePath === path ? 'page' : undefined}
          >
            <Icon className='icon-nav' />
            <span className='li-icon-bottom'>{label}</span>
          </button>
        ))}
      </nav>

      <nav className='nav-bar__section nav-bar__section--right' aria-label='Account navigation'>
        {!isLoggedIn ? (
          <>
            <button
              type='button'
              className={`Nav-tag Nav-button ${activePath === '/login' ? 'active' : ''}`}
              onClick={() => handleNavigate('/login')}
            >
              <FiLogIn className='icon-nav' />
              <span className='login-register'>Login</span>
            </button>

            <button
              type='button'
              className={`Nav-tag ${activePath === '/register' ? 'active' : ''}`}
              onClick={() => handleNavigate('/register')}
            >
              <FiUserPlus className='icon-nav' />
              <span className='login-register'>Register</span>
            </button>
          </>
        ) : (
          <div className='logout-username'>
            <button
              type='button'
              className={`Nav-tag ${activePath.startsWith('/profile/') ? 'active' : ''}`}
              onClick={() => handleNavigate(`/profile/${getUserOpname()}`)}
            >
              <FiUser className='icon-nav' />
              <span className='login-register'>{getUserOpname()}</span>
            </button>

            <button
              type='button'
              className='Nav-tag logout-button'
              onClick={() => setShowLogoutDialog(true)}
            >
              <FiLogOut className='icon-nav' />
              <span className='login-register'>Logout</span>
            </button>
          </div>
        )}
      </nav>

      {showLogoutDialog && (
        <div className='logout-dialog-backdrop' onClick={() => setShowLogoutDialog(false)}>
          <div
            className='logout-dialog'
            role='dialog'
            aria-modal='true'
            aria-labelledby='logout-dialog-title'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='logout-dialog__header'>
              <span className='logout-dialog__icon'>!</span>
              <h3 id='logout-dialog-title'>Do you want to logout?</h3>
            </div>
            <p className='logout-dialog__text'>You can log back in anytime and continue from where you left off.</p>
            <div className='logout-dialog__actions'>
              <button type='button' className='dialog-button dialog-button--secondary' onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </button>
              <button type='button' className='dialog-button dialog-button--primary' onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;

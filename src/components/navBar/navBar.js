import { useEffect, useState } from 'react';
import css from './navBarStyle.css'
import { json, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
function NavBar() {
  const [actClass, setActClass] = useState(1);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    //If we refersh the page then we will agin be at same page only
    setActClass(localStorage.getItem("currentPage"));
  },)

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    // console.log(open);
    setOpenDialog(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };

  function setActiveNavbar(val) {
    //Assigning the previous page number in local storage
    localStorage.setItem("currentPage", val);
    if (val == 0) {
      //logo (redirect to home)
      localStorage.setItem("currentPage", 1);
      setActClass(1);
      navigate("/");
    }
    else if (val == 1) {
      //home
      setActClass(1);
      navigate("/");
    }
    else if (val == 2) {
      //Leader Board
      setActClass(2);
      navigate("/ratings");
    }
    else if (val == 3) {
      //Upcoming Contests
      setActClass(3);
      navigate("/contests");
    }
    else if (val == 4) {
      //Trending Problems
      setActClass(4);
      navigate("/problemset");
    }
    else if (val == 5) {
      //Login
      setActClass(5);
      navigate("/login");
    }
    else if (val == 6) {
      //Register
      setActClass(6);
      navigate("/register");
    }
    else if (val == 7) {
      //Chats
      setActClass(7);
      navigate("/messaging");
    }
    else if (val == 8) {
      //logout
      localStorage.clear();
      localStorage.setItem("currentPage", 1);
      setActClass(1);
      setOpenDialog(false);
      navigate("/");
    }
    else if (val == 9) {
      setActClass(9);
      console.log("fasdfs");
      navigate(`/profile/${getUserOpname()}`)
    }
  }

  function getUserOpname() {
    let item = localStorage.getItem("username")
    item = JSON.parse(item);
    
    return item;
  }
  return (
    <div className='nav-bar'>
      <ul className='unordered-list'>
        <div onClick={() => { setActiveNavbar(0) }} className='Nav-tag logo'><li className='logo-h3' >OneProfile</li></div>
        <div onClick={() => { setActiveNavbar(1) }} className={`Nav-tag ${actClass == 1 ? "active" : null}`}><HomeIcon className='icon-nav'></HomeIcon><li className='li-icon-bottom'>Home</li></div>
        <div onClick={() => { setActiveNavbar(2) }} className={`Nav-tag ${actClass == 2 ? "active" : null}`}><LeaderboardRoundedIcon className='icon-nav'></LeaderboardRoundedIcon><li className='li-icon-bottom'>Ratings</li></div>
        <div onClick={() => { setActiveNavbar(3) }} className={`Nav-tag ${actClass == 3 ? "active" : null}`}><NotificationsActiveRoundedIcon className='icon-nav'></NotificationsActiveRoundedIcon><li className='li-icon-bottom'>Contests</li></div>
        <div onClick={() => { setActiveNavbar(4) }} className={`Nav-tag ${actClass == 4 ? "active" : null}`}><TrendingUpRoundedIcon className='icon-nav' ></TrendingUpRoundedIcon><li className='li-icon-bottom'>ProblemSet</li></div>
        <div onClick={() => { setActiveNavbar(7) }} className={`Nav-tag ${actClass == 7 ? "active" : null}`}><SmsRoundedIcon className='icon-nav' ></SmsRoundedIcon><li className='li-icon-bottom'>Messaging</li></div>
      </ul>

      <ul className='unordered-list'>
        {
          !localStorage.getItem("token") ? <div onClick={() => { setActiveNavbar(5) }} className={`Nav-tag Nav-button ${actClass == 5 ? "active" : null}`}><li className='login-register'>Login</li></div>
            : null
        }
        {
          !localStorage.getItem("token") ? <div onClick={() => { setActiveNavbar(6) }} className={`Nav-tag ${actClass == 6 ? "active" : null}`}><li className='login-register'>Register</li></div>
            : <div className={`Nav-tag ${actClass == 8 ? "active" : null}`} >
              <div className='logout-username'>
                <div onClick={() => { setActiveNavbar(9) }} className={`Nav-tag ${actClass == 9 ? "active" : null}`}><li className='login-register'>{getUserOpname()}</li></div>
                <div onClick={handleClickOpen} className={`Nav-tag ${actClass == 8 ? "active" : null}`}><li className='login-register'>Logout</li></div>
              </div>
              {openDialog ? <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Do you want to logout?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={() => setActiveNavbar(8)} autoFocus>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
                : null
              }
            </div>
        }

      </ul>
      <script src=""></script>
    </div>
  );
}

export default NavBar;

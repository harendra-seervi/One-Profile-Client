import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import {
    TextField,
    InputLabel,
    Select,
    FormControl,
} from '@mui/material';
import { PhotoCamera, InsertDriveFile, Preview } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import { Spin } from 'antd';


import "./home.css";
function HomePage() {
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [textFormat, setTextFormat] = useState('none');
    const [allBlog, setAllBlog] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();
    const [blogLoading, setBlogLoading] = useState(false);
    // cosnt 
    const handleButtonClick = () => {
        setSuccess(false);
        setLoading(true);
        handlePost();

    };

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    async function getAllPost() {
        setBlogLoading(true);
        let posts = await fetch("http://localhost:5000/blog", {
            method: 'GET'
        });
        posts = await posts.json();
        // console.log(posts);
        setBlogLoading(false);
        setAllBlog(posts);
    }
    React.useEffect(() => {
        getAllPost();
    }, [])

    const handleExplanationChange = (event) => {
        setExplanation(event.target.value);
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = function (e) {
            setSelectedImage(fileReader.result);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handlePreview = () => {
        // Perform any preview logic here
        console.log('Preview clicked');
    };
    const handlePost = async () => {
        try {
            const data = {
                title: title,
                description: explanation,
                files: selectedImage
            };

            console.log(data);
            let token = localStorage.getItem('token');
            token = token.substr(1, token.length - 2);
            const response = await fetch('http://localhost:5000/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Post created successfully');
                setSuccess(true);
                setLoading(false);
                setTimeout(() => {
                    handleClose();
                    getAllPost();
                    setSuccess(false);
                    setSelectedImage(null);
                    setTitle('');
                    setExplanation('');
                }, 1000);
            } else {
                console.log('Failed to create post');
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleOpen = () => {
        setEditorOpen(true);
    };

    const handleClose = () => {
        setEditorOpen(false);
    };

    const handleClickOpenDG = () => {
        setOpen(true);
    };

    const handleCloseDG = () => {
        setOpen(false);
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const actions = [
        { icon: <FileCopyIcon />, name: 'Copy' },
        { icon: <SaveIcon />, name: 'Save' },
        { icon: <EditIcon />, name: 'Create Blog' },
        { icon: <ShareIcon />, name: 'Share' },
    ];
    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function editBlog(actionname) {
        if (actionname === "Create Blog") {
            handleOpen();
        }
    }

    const convertToIndianTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };
        return date.toLocaleString('en-IN', options);
    };

    async function handleLike(blogId) {
        let token = localStorage.getItem('token');
        token = token.substr(1, token.length - 2);
        let finalCount = await fetch("http://localhost:5000/blog/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({_id: blogId})
        })
        finalCount = await finalCount.json();
        console.log(finalCount);
    }

    return (
        <div className='home-card'>
            <div>
                {/* Dialog box ------------------------>*/}
                <div style={{ display: 'none' }}>
                    <Dialog open={editorOpen} onClose={handleClose}>
                        <DialogTitle>Create Blog</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Title"
                                value={title}
                                onChange={handleTitleChange}
                                fullWidth
                                sx={{ margin: '10px' }}
                            />
                            <TextField
                                label="What do want to talk about?"
                                multiline
                                rows={4}
                                value={explanation}
                                onChange={handleExplanationChange}
                                fullWidth
                                sx={{ margin: '10px' }}
                            />

                            {selectedImage && (
                                <Box mt={2}>
                                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%' }} />
                                </Box>
                            )}
                            <Box mt={2}>
                                <input
                                    accept="image/*"
                                    id="image-upload"
                                    multiple={false}
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                    sx={{ margin: '10px' }}

                                />
                                <label htmlFor="image-upload">
                                    <Button sx={{ margin: '10px' }} variant="contained" component="span" startIcon={<PhotoCamera />}>
                                        Upload Image
                                    </Button>
                                </label>
                            </Box>

                            {selectedFile && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">{selectedFile.name}</Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            {/* post button animation  */}

                            <Box sx={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <Fab
                                        aria-label="save"
                                        color="primary"
                                        sx={buttonSx}
                                    >
                                        {success ? <CheckIcon /> : <SaveIcon />}
                                    </Fab>
                                    {loading && (
                                        <CircularProgress
                                            size={68}
                                            sx={{
                                                color: green[500],
                                                position: 'absolute',
                                                top: -6,
                                                left: -6,
                                                zIndex: 1,
                                            }}
                                        />
                                    )}
                                </Box>
                                {!loading ? <Box sx={{ m: 1, position: 'relative' }}>
                                    <Button
                                        variant="contained"
                                        sx={buttonSx}
                                        disabled={loading}
                                        onClick={handleButtonClick}
                                    >
                                        Post
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: green[500],
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    )}
                                </Box> : null}
                            </Box>

                            {/* <Button onClick={handlePost} color="primary" variant="contained">
                                Post
                            </Button> */}
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            {/* Plus button ------------------->*/}
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: 30, right: 40 }}>
                <SpeedDial
                    ariaLabel="SpeedDial openIcon example"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                    onClick={handleOpen}
                >
                    {/* {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => editBlog(action.name)}
                        />
                    ))} */}
                </SpeedDial>
            </Box>
            {/* post card ------------------>*/}
            {blogLoading ? <Spin style={{ marginTop: '50vh' }} size="large" />
                : null}
            {allBlog.map((blog) => {
                return <div className='card-outline'>
                    <Card sx={{ width: 900 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    H
                                </Avatar>
                            }
                            action={
                                <div>
                                    <IconButton aria-label="settings" onClick={handleMenuClick}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={handleMenuClose}>Edit Post</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Not Interested</MenuItem>
                                    </Menu>
                                </div>
                            }
                            title={blog.name}
                            subheader={convertToIndianTime(blog.createdAt)}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {blog.title}
                            </Typography>
                        </CardContent>
                        <CardMedia
                            component="img"
                            height="440"
                            image={blog.imagelink.url}
                            alt="Not able to fetch image"
                        />
                        {/* //dsds */}
                        <CardActions disableSpacing>
                            <IconButton aria-label="like" onClick={() => handleLike(blog._id)}>
                                <ThumbUpIcon />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {blog.like.length}
                            </Typography>
                            <IconButton aria-label="dislike">
                                <ThumbDownIcon />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {blog.dislike.length}
                            </Typography>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>
                                    {blog.description}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </div>;
            })
            }

        </div>
    );
}

export default HomePage;


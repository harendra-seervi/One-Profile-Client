import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { borderRadius } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import './problemset.css'
function ProblemSet() {
    const [rows, setRows] = useState([]);
    const [problemCount, setProblemCount] = useState(0);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedTopicTag, setSelectedTopicTag] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isLoading,setIsLoading]=useState(false);
    let GUserName = localStorage.getItem("username");
    GUserName = GUserName.substring(1, GUserName.length - 1);

    async function checkFun(link) {
        let username = localStorage.getItem("username");
        let rem = await fetch("")
        return true;
    }

    async function getAllProblems() {
        setIsLoading(false);
        let response = await fetch("http://localhost:5000/problemset/", {
            method: 'GET'
        });

        let data = await response.json();
        let str = localStorage.getItem('username');
        const userName = str.substring(1, str.length - 1);
        const updatedArray = data.map((element) => {
            const isChecked = element.status.includes(userName);
            return { ...element, checked: isChecked, key: element._id };
        });
        let count = 0;
        updatedArray.map((obj) => {
            if (obj.checked) {
                count = count + 1;
            }
        })

        setProblemCount(count);
        setRows(updatedArray);
        setIsLoading(true);
    }
    

    useEffect(() => {
        getAllProblems();
        // problemCount;
    }, [])

    
    
    async function checkBoxClick(link) {
        let str = localStorage.getItem('username');
        const userName = str.substring(1, str.length - 1);

        let respo = await fetch("http://localhost:5000/problemset/changestatus", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userName,
                link: link
            })
        });
        // getAllProblems();
        respo = await respo.json();
        if (respo == true) setProblemCount(problemCount + 1);
        else setProblemCount(problemCount - 1);
    }

    const columns = [
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                params.row.checked ? <Checkbox
                    defaultChecked
                    onClick={() => checkBoxClick(params.row.link)}
                /> : <Checkbox
                    onClick={() => checkBoxClick(params.row.link)}
                />

            ),
            disableColumnMenu: true, sortable: false
        },
        { field: 'id', headerName: 'ID', width: 100, disableColumnMenu: true, sortable: false },
        { field: 'title', headerName: 'title', width: 340, sortable: false },
        {
            field: 'topictag',
            headerName: 'topictag',
            width: 142,
            disableColumnMenu: true, sortable: false
        },
        { field: 'difficulty', headerName: 'Difficulty', width: 80, disableColumnMenu: true, sortable: false },
        { field: 'platform', headerName: 'Available On', width: 160, disableColumnMenu: true, sortable: false },
        { field: 'companytag', headerName: 'Company Tag', width: 120, disableColumnMenu: true, sortable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 185,
            disableColumnFilter: true,
            renderCell: (params) => (
                <div>
                    <button style={{ margin: "10px", cursor: 'pointer', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', padding: "5px" }} onClick={() => solveClicked(params.row)}>Solve</button>
                    <button style={{ margin: "10px", cursor: 'pointer', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: "5px" }} onClick={() => noteClicked(params.row)}>Note</button>
                </div>
            ),
            className: "MuiDataGrid-cell custom-data-grid",
            disableColumnMenu: true, sortable: false
        },
    ];




    const handleFilterStatus = (event) => {
        const value = event.target.value;
        setSelectedStatus(value);
    };



    const handleFilterTopicTag = (event) => {
        setSelectedTopicTag(event.target.value);
    };
    function solveClicked(row) {
        window.open(row.link)
    }

    function noteClicked(row) {
        // Perform any note-related action here
    }

    const handleFilterChange = (event) => {
        setSelectedSheet(event.target.value);
    };

    const handleFilterDiff = (event) => {
        setSelectedDifficulty(event.target.value);
    }

    const filteredRows = rows.filter((row) => {
        if (selectedSheet && selectedDifficulty && selectedTopicTag) {
            return (
                row.companytag === selectedSheet &&
                row.difficulty === selectedDifficulty &&
                row.topictag === selectedTopicTag &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedSheet && selectedDifficulty) {
            return (
                row.companytag === selectedSheet &&
                row.difficulty === selectedDifficulty &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedSheet && selectedTopicTag) {
            return (
                row.companytag === selectedSheet &&
                row.topictag === selectedTopicTag &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedDifficulty && selectedTopicTag) {
            return (
                row.difficulty === selectedDifficulty &&
                row.topictag === selectedTopicTag &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedSheet) {
            return (
                row.companytag === selectedSheet &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedDifficulty) {
            return (
                row.difficulty === selectedDifficulty &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedTopicTag) {
            return (
                row.topictag === selectedTopicTag &&
                (selectedStatus === "" || row.checked === (selectedStatus === "solved"))
            );
        } else if (selectedStatus) {
            return row.checked === (selectedStatus === "solved");
        } else {
            return true; // No filters selected, show all rows
        }
    });

    const sheetNames = [...new Set(rows.map((row) => row.companytag))];
    const topicTags = [...new Set(rows.map((row) => row.topictag))];
    const statuses = [...new Set(rows.map((row) => row.status))];
    return (
        <div className="rating-dashboard">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px',
                    scale: '.97',
                    // backgroundColor:'yellowgreen',
                    borderRadius: '10px',
                    // marginBottom: '10px',
                    marginTop: '10px'
                }}
            >
                <h1
                    className="rating-heading"
                    style={{
                        margin: '1px',
                        // width: '300px',
                        color: '#0048ffe6',
                        padding: '10px',
                        paddingRight: '0px',
                    }}
                >
                    Problemset
                </h1>



                <FormControl style={{ margin: '12px' }}>
                    <Select
                        value={selectedDifficulty}
                        onChange={handleFilterDiff}
                        displayEmpty
                        variant='standard'
                    >
                        <MenuItem value="" key="difficulty-all">
                            Difficulty
                        </MenuItem>
                        <MenuItem value="Easy" key="difficulty-easy">
                            Easy
                        </MenuItem>
                        <MenuItem value="Medium" key="difficulty-medium">
                            Medium
                        </MenuItem>
                        <MenuItem value="Hard" key="difficulty-hard">
                            Hard
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '12px' }}>
                    <Select
                        value={selectedTopicTag}
                        onChange={handleFilterTopicTag}
                        displayEmpty
                        variant='standard'
                    >
                        <MenuItem value="">Topic Tag</MenuItem>
                        {topicTags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl style={{ margin: '12px' }}>
                    <Select
                        value={selectedStatus}
                        onChange={handleFilterStatus}
                        displayEmpty
                        variant='standard'
                    >
                        <MenuItem value="">All Problems</MenuItem>
                        <MenuItem key="Solved" value="solved">
                            Solved
                        </MenuItem>
                        <MenuItem key="Unsolved" value="unsolved">
                            Unsolved
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl style={{ margin: '12px' }}>
                    <Select
                        value={selectedSheet}
                        onChange={handleFilterChange}
                        displayEmpty
                        variant='standard'
                    >
                        <MenuItem value="" >
                            Company Tag
                        </MenuItem>
                        {sheetNames.map((sheetName) => (
                            <MenuItem key={sheetName} value={sheetName}>
                                {sheetName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Paper
                sx={{ margin: 'auto', width: '96%', overflow: 'hidden' }}
                elevation={3}
            >
                <div className='tableupper' style={{ display: 'flex', justifyContent: 'center', paddingLeft: '5px', color: 'green' }}>
                    <h3 style={{ backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '8px', paddingLeft: '20px', paddingRight: '20px' }}>Solved Problems {problemCount}</h3>
                </div>
                {isLoading ? <DataGrid
                    disableSelectionOnClick
                    rows={filteredRows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    className="MuiDataGrid-cell custom-data-grid"
                />
                    : <Box sx={{ display: 'flex', justifyContent: 'center',height:'60px',marginTop:'12px' }}>
                        <CircularProgress />
                    </Box>
                }
            </Paper>
        </div>
    );
}

export default ProblemSet;

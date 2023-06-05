import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { TableSortLabel, TextField } from '@mui/material';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const columns = [
  { id: 'site', label: 'Site', minWidth: '300' },
  { id: 'name', label: 'Name', minWidth: '400', align: 'right', format: (value) => value.toLocaleString('en-US') },
  { id: 'start_time', label: 'Start', align: 'right', format: (value) => value.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), sort: true },
  { id: 'end_time', label: 'End', align: 'right', format: (value) => value.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), sort: true },
];

function Ratings() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [platForm, setPlatForm] = React.useState("All Platform");

  useEffect(() => {
    showRatings();
  }, []);

  async function showRatings() {
    let result = await fetch('https://kontests.net/api/v1/all');
    result = await result.json();
    setLoading(true);
    setRows(result);
  }

  const handleSort = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(columnId);
    const sortedRows = rows.sort((a, b) => {
      if (a[columnId] < b[columnId]) {
        return isAsc ? -1 : 1;
      }
      if (a[columnId] > b[columnId]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    setRows(sortedRows);
    setPage(0);
  };

  function convertUtcToIst(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const utcDate = new Date();
    utcDate.setUTCHours(hours);
    utcDate.setUTCMinutes(minutes);
    utcDate.setUTCSeconds(seconds);

    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const istDate = utcDate.toLocaleString('en-IN', options);
    return istDate;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();
  function test(val) {
    window.location.href = val;
  }

  const handleSearch = (event) => {

    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const siteName = row.site.toLowerCase() + row.name.toLowerCase() + row.start_time.toLowerCase() + row.end_time.toLowerCase();
    if (platForm == "All Platform") return siteName.includes("") && siteName.includes(searchText.toLowerCase());
    else return siteName.includes(platForm.toLowerCase()) && siteName.includes(searchText.toLowerCase());

  });

  const handleChange = (event) => {
    setPlatForm(event.target.value);
  };
  return (
    <div className="rating-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', scale: '.97' }}>
        <h1 className="rating-heading" style={{ marginLeft: "15px", width: '500px', color: "#0048ffe6", padding: '10px', }}>Upcoming Contests</h1>
        <Box sx={{}}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={platForm}
            label="Platform"
            variant='standard'
            onChange={handleChange}
            style={{ margin: '15px' }}
          >
            <MenuItem value={"All Platform"}>All Platforms</MenuItem>
            <MenuItem value={"codeforces"}>CodeForces</MenuItem>
            <MenuItem value={"CodeChef"}>CodeChef</MenuItem>
            <MenuItem value={"Atcoder"}>Atcoder</MenuItem>
            <MenuItem value={"Hackerrank"}>HackerRank</MenuItem>
            <MenuItem value={"HackerEarth"}>HackerEarth</MenuItem>
            <MenuItem value={"LeetCode"}>LeetCode</MenuItem>
          </Select>
        </Box>
        <TextField
          label="Search for Contest name, Start time..."
          variant="standard"
          value={searchText}
          onChange={handleSearch}
          style={{ width: '350px', marginRight: '20px', }}
        />
      </div>

      <Paper sx={{ margin: 'auto', width: '96%', overflow: 'hidden' }} elevation={3}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ width: 10 }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={'center'}
                    style={{
                      minWidth: column.minWidth,
                      color: '#0048ffe6',
                      fontWeight: '600',
                      backgroundColor: '#fafafa',
                    }}
                    sortDirection={sortColumn === column.id ? sortDirection : false}
                  >
                    {column.sort ? (
                      <TableSortLabel
                        active={sortColumn === column.id}
                        direction={sortColumn === column.id ? sortDirection : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {!loading ? <TableRow><TableCell ></TableCell><TableCell></TableCell><TableCell><Box sx={{ display: 'flex', }}><CircularProgress /> </Box></TableCell> <TableCell></TableCell> </TableRow>
              : (
                <TableBody>
                  {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    if (row.start_time[3] !== '3') {
                      return null;
                    }
                    return (
                      <TableRow
                        className="row-table"
                        onClick={() => test(row.url)}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          let platformColor = "black";
                          // let boldPlatform=""
                          if (value == "HackerRank") platformColor = "blue";
                          else if (value[4] == 'F') platformColor = "red";
                          else if (value[4] == 'C') platformColor = "brown";
                          else if (value == "HackerEarth") platformColor = "green";
                          let fontW;
                          if (column.id == 'site') fontW = 600;
                          return (
                            <TableCell sx={{ color: platformColor, fontWeight: fontW, cursor: 'pointer' }} key={value.substring(0, 30)} align={'center'}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : column.id === 'start_time' || column.id === 'end_time'
                                  ? value.substring(0, 10).replace('T', ' ')+ " [" + convertUtcToIst(value.substring(11, 19))+"]"
                                  : value.substring(0, 30)
                                  // : console.log(value.substring(13, 21))
                              }
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Ratings;

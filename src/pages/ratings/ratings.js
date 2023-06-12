import React, { useEffect, useState, useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { TableSortLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import countryList from 'react-select-country-list'
import Select from 'react-select'
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
const columns = [
  { id: 'rank', label: 'Rank', minWidth: 170, sort: true },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'country', label: 'Country', minWidth: 100, align: 'right', format: (value) => value.toLocaleString('en-US') },
  { id: 'rating', label: 'OP Rating', minWidth: 100, align: 'right', format: (value) => value.toLocaleString('en-US'), sort: true },
];

function Ratings() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [instituteFilter, setInstituteFilter] = useState('');
  const options = useMemo(() => countryList().getData(), [])
  const [value, setValue] = useState('');
  const [open, setOpen] = React.useState(true);
  const [lupdate,setLUpdate]=useState("");

  useEffect(() => {
    showRatings();
  }, []);

  async function showRatings() {
    setLoading(false);
    let result = await fetch('http://localhost:5000/ratings');
    setLoading(true);
    result = await result.json();
    setLUpdate(result[0].lastupdate);
    setRows(result);
  }
  const changeHandler = value => {
    setValue(value)
    setCountryFilter(value.label);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();
  function test(val) {
    navigate(`/profile/${val}`);
  }

  const filterRows = (rows) => {
    return rows.filter((row) => {
      const nameMatch = row.name.toLowerCase().includes(nameFilter.toLowerCase());
      const countryMatch = row.country.toLowerCase().includes(countryFilter.toLowerCase());
      return nameMatch && countryMatch;
    });
  };

  const filteredRows = filterRows(rows);

  return (
    <div className="rating-dashboard" >
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', paddingTop: '0px', scale: '.96', }}>
        <h1 className="rating-heading" style={{ color: "#0048ffe6", padding: '10px', marginTop: '10px' }}>Leader Board</h1>
        <TextField
          label="Search by Name"
          variant='standard'
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ marginTop: '10px' }}
        />

        <Box sx={{ width: 300 }}>
          <Select
            placeholder="Select Country"
            className="country-select"
            options={options}
            value={value}
            variant="standard"
            onChange={changeHandler}
            sx={{ width: '100%', margin: 0, scale: '1.2' }} // Increase the width value as needed
          />
        </Box>

        <TextField
          label="Search by Institute"
          variant='standard'
          // value={nameFilter}
          // onChange={(e) => setNameFilter(e.target.value)}
          style={{ marginRight: '30px', marginTop: '10px' }}
        />
        <Button
          disabled={open}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
          style={{height:'40px',width:'170px',marginTop:'19px',padding:'10px'}}
        >
          Show Last Update
        </Button>
      </div>
      <Box sx={{ width: '100%' }}>
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {`The rankings were last updated on ${lupdate}. Updates occur every 4 hours`}
          </Alert>
        </Collapse>
        
      </Box>
      <Paper sx={{ margin: 'auto', width: '96%', overflow: 'hidden' }} elevation={3}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table aria-label="sticky table">
            <TableHead sx={{}}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
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
            {!loading ? (
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex',justifyContent:'center' }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      className="row-table"
                      onClick={() => test(row.opusername)}
                      hover
                      sx={{ cursor: "pointer" }}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
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

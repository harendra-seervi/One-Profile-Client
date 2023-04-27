import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import './ratings.css'
import { TableSortLabel } from '@mui/material';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
const columns = [  { id: 'rank', label: 'Rank', minWidth: 170,sort:true },  { id: 'name', label: 'Name', minWidth: 100 },  {    id: 'country',    label: 'Country',    minWidth: 170,    align: 'right',    format: (value) => value.toLocaleString('en-US'),  },  {    id: 'rating',    label: 'OP Rating',    minWidth: 170,    align: 'right',    format: (value) => value.toLocaleString('en-US'),  sort: true }, ];

function Ratings() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState('name');

  useEffect(() => {
    showRatings();
  }, []);

  async function showRatings() {
    let result = await fetch('http://localhost:5000/ratings');
    result = await result.json();
    
    setRows(result);
    // console.log(result);
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

const navigate=useNavigate();
function test(val){
  navigate(`/profile/${val}`);
}
  return (
    <div className="rating-dashboard">
      <h1 className="rating-heading">Leader Board</h1>
      <Paper sx={{margin:'auto', width: '95%', overflow: 'hidden' }} elevation={0}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
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
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                  <TableRow className='row-table' onClick={()=>test(row.opusername)} hover role="checkbox" tabIndex={-1} key={row.code}>
                    {
                      columns.map((column) => {
                        // setRankCt(rankCt+1)
                      const value = row[column.id];
                      // console.log("Column id ",row[column.id]);
                      return (
                        <TableCell key={column.id} align={column.align} >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })
                    
                    }
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
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

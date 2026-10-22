import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list';
import Select from 'react-select';
import './ratings.css';

const columns = [
  { id: 'rank', label: 'Rank', minWidth: 80, sort: true },
  { id: 'name', label: 'Name', minWidth: 180, sort: true },
  { id: 'country', label: 'Country', minWidth: 140, sort: true },
  { id: 'compositeRating', label: 'OP Rating', minWidth: 120, sort: true },
];

function Ratings() {
  const API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://one-profile-server.vercel.app'
    : 'http://localhost:5000';

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortColumn, setSortColumn] = useState('rating');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countryOptions = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    showRatings();
  }, []);

  async function showRatings() {
    setLoading(true);
    setFetchError('');
    try {
      const result = await fetch(`${API_BASE}/api/ratings`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!result.ok) {
        throw new Error(`Server responded with status ${result.status}`);
      }

      const responseJson = await result.json();
      const data = responseJson.success ? responseJson.data : [];

      if (Array.isArray(data) && data.length > 0) {
        setRows(data);
        setLastUpdate(data[0]?.lastRatingUpdate ? new Date(data[0].lastRatingUpdate).toLocaleString() : '');
      } else {
        setRows([]);
        setLastUpdate('');
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
      setFetchError('Unable to load leaderboard right now. Please check that the backend server is running and try again.');
      setRows([]);
      setLastUpdate('');
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    const nextDirection = isAsc ? 'desc' : 'asc';
    setSortColumn(columnId);
    setSortDirection(nextDirection);
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    const result = rows.filter((row) => {
      const name = String(row.name || '').toLowerCase();
      const country = String(row.country || '').toLowerCase();
      const matchesName = name.includes(nameFilter.toLowerCase());
      const matchesCountry = !countryFilter || country === countryFilter.toLowerCase();
      return matchesName && matchesCountry;
    });

    return [...result].sort((a, b) => {
      const left = a[sortColumn];
      const right = b[sortColumn];

      if (typeof left === 'number' && typeof right === 'number') {
        return sortDirection === 'asc' ? left - right : right - left;
      }

      const leftVal = String(left ?? '').toLowerCase();
      const rightVal = String(right ?? '').toLowerCase();

      if (leftVal < rightVal) return sortDirection === 'asc' ? -1 : 1;
      if (leftVal > rightVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, nameFilter, countryFilter, sortColumn, sortDirection]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setCountryFilter(value ? value.label.toLowerCase() : '');
    setPage(0);
  };

  const openProfile = (username) => {
    if (!username) return;
    navigate(`/profile/${username}`);
  };

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalCountries = new Set(rows.map((row) => row.country).filter(Boolean)).size;
  const averageRating = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + Number(row.compositeRating || 0), 0) / rows.length)
    : 0;

  return (
    <div className="rating-dashboard">
      <div className="rating-content-wrapper">
      <div className="rating-header-row">
        <div className="rating-title-wrap">
          <span className="section-kicker">Community</span>
          <h1 className="rating-heading">Leaderboard</h1>
        </div>

        <div className="rating-controls">
          <TextField
            label="Search by Name"
            variant="outlined"
            value={nameFilter}
            onChange={(event) => {
              setNameFilter(event.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          />

          <Box className="country-picker-wrap" sx={{ minWidth: 220 }}>
            <Select
              classNamePrefix="country-select"
              placeholder="Select Country"
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
              isClearable
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  minHeight: '40px',
                  borderRadius: '12px',
                  borderColor: 'rgba(148, 163, 184, 0.45)',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#60a5fa' },
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '12px',
                  overflow: 'hidden',
                }),
              }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={() => {
              setNameFilter('');
              setCountryFilter('');
              setSelectedCountry(null);
              setPage(0);
            }}
            className="secondary-button"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {fetchError && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={showRatings} disabled={loading}>
              Retry
            </Button>
          }
        >
          {fetchError}
        </Alert>
      )}

      {lastUpdate && !fetchError && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          {`The rankings were last updated on ${lastUpdate}. Updates occur every 3 Mins.`}
        </Alert>
      )}

      <Box className="stats-row" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 2, mb: 2 }}>
        <Box className="stat-card">
          <span className="stat-label">Total Users</span>
          <strong>{rows.length}</strong>
        </Box>
        <Box className="stat-card">
          <span className="stat-label">Countries</span>
          <strong>{totalCountries}</strong>
        </Box>
        <Box className="stat-card">
          <span className="stat-label">Average Rating</span>
          <strong>{averageRating}</strong>
        </Box>
      </Box>

      <Paper className="table-shell" elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader aria-label="leaderboard table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === 'rating' ? 'right' : 'left'}
                    sx={{ color: '#1d4ed8', fontWeight: 700, background: '#f8fafc' }}
                  >
                    {column.sort ? (
                      <TableSortLabel
                        active={sortColumn === column.id}
                        direction={sortColumn === column.id ? sortDirection : 'asc'}
                        onClick={() => handleSort(column.id)}
                        sx={{ color: 'inherit', '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
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
                {fetchError || filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5, color: '#64748b' }}>
                      {fetchError || 'No users match your filters.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRows.map((row) => (
                    <TableRow
                      key={row.opusername || row.name}
                      hover
                      onClick={() => openProfile(row.opusername)}
                      sx={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
                    >
                      <TableCell>{row.rank}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</TableCell>
                      <TableCell>{row.country}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#1d4ed8' }}>{row.compositeRating}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                      <CircularProgress size={20} />
                      <span>Loading leaderboard...</span>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {!loading && !fetchError && filteredRows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      </div>
    </div>
  );
}

export default Ratings;

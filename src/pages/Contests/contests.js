import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
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


const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://one-profile-server.vercel.app'
  : 'http://localhost:5000';

const PLATFORM_OPTIONS = ['All', 'Codeforces', 'AtCoder', 'LeetCode', 'HackerRank'];

function formatDate(dateValue) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function getPlatformColor(platform) {
  const normalized = String(platform || '').toLowerCase();
  if (normalized.includes('codeforces')) return '#f97316';
  if (normalized.includes('atcoder')) return '#8b5cf6';
  if (normalized.includes('leetcode')) return '#f59e0b';
  if (normalized.includes('hackerrank')) return '#22c55e';
  return '#f8fafc';
}

function getContestDifficulty(platform, contestName) {
  const text = String(contestName || '').toUpperCase();

  if (platform === 'Codeforces') {
    if (text.includes('DIV. 1')) return 'Div. 1';
    if (text.includes('DIV. 2')) return 'Div. 2';
    if (text.includes('DIV. 3')) return 'Div. 3';
    if (text.includes('GLOBAL')) return 'Global';
    if (text.includes('EDU')) return 'Edu';
    if (text.includes('ICPC')) return 'ICPC';
    return 'Contest';
  }

  if (platform === 'AtCoder') {
    if (text.includes('AGC')) return 'AGC';
    if (text.includes('ARC')) return 'ARC';
    if (text.includes('ABC')) return 'ABC';
    if (text.includes('AHC')) return 'AHC';
    if (text.includes('AAL')) return 'AAL';
    if (text.includes('AWC')) return 'AWC';
    return 'Contest';
  }

  if (platform === 'LeetCode') {
    if (text.includes('BIWEEKLY')) return 'Biweekly';
    if (text.includes('WEEKLY')) return 'Weekly';
    return 'Contest';
  }

  if (platform === 'HackerRank') return 'Contest';

  return 'N/A';
}

function Contests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('start');
  const [sortDirection, setSortDirection] = useState('asc');
  const [contestTab, setContestTab] = useState('upcoming');

  const nowTimestamp = Date.now();

  useEffect(() => {
    fetchContests();
  }, []);

  async function fetchContests() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE}/api/contests`, {
        headers: { Accept: 'application/json' },
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Unable to fetch contest list');
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error('Failed to fetch contests:', err);
      setError('Unable to load contests right now. Please try again in a moment.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const baseFilteredRows = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesPlatform = platformFilter === 'All' || row.platformLabel === platformFilter;
      const searchable = `${row.name || ''} ${row.platformLabel || ''} ${row.difficulty || ''}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);

      const hasStart = !!row.start;
      const rowTime = hasStart ? new Date(row.start).getTime() : null;
      const isUpcoming = !rowTime || rowTime >= nowTimestamp;
      const isPast = !!rowTime && rowTime < nowTimestamp;

      const matchesTab = contestTab === 'upcoming' ? isUpcoming : isPast;
      return matchesPlatform && matchesSearch && matchesTab;
    });
  }, [rows, searchText, platformFilter, contestTab, nowTimestamp]);

  const filteredRows = useMemo(() => {
    return [...baseFilteredRows].sort((a, b) => {
      const left = a[sortColumn] ? new Date(a[sortColumn]).getTime() : Number.MAX_SAFE_INTEGER;
      const right = b[sortColumn] ? new Date(b[sortColumn]).getTime() : Number.MAX_SAFE_INTEGER;
      return sortDirection === 'asc' ? left - right : right - left;
    });
  }, [baseFilteredRows, sortColumn, sortDirection]);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="rating-dashboard">
      <div className="rating-content-wrapper" style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 18px 40px' }}>
        <div className="rating-header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '18px 20px',
          borderRadius: 20,
          background: 'linear-gradient(90deg, rgba(16, 24, 40, 0.94), rgba(8, 17, 29, 0.94))',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
          marginBottom: 18,
        }}>
          <div className="rating-title-wrap">
            <span className="section-kicker">Community</span>
            <h1 className="rating-heading" style={{ margin: 0 }}>
              {contestTab === 'upcoming' ? 'Upcoming Contests' : 'Past Contests'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tabs
              value={contestTab}
              onChange={(_, nextTab) => {
                setContestTab(nextTab);
                setPage(0);
              }}
              sx={{
                minHeight: 0,
                '& .MuiTabs-indicator': { backgroundColor: '#fbbf24', height: 3, borderRadius: 3 },
              }}
            >
              <Tab
                value="upcoming"
                label="Upcoming"
                sx={{
                  color: contestTab === 'upcoming' ? '#fbbf24' : '#cbd5e1',
                  fontWeight: 700,
                  textTransform: 'none',
                  minHeight: 40,
                }}
              />
              <Tab
                value="past"
                label="Past Contests"
                sx={{
                  color: contestTab === 'past' ? '#fbbf24' : '#cbd5e1',
                  fontWeight: 700,
                  textTransform: 'none',
                  minHeight: 40,
                }}
              />
            </Tabs>

            <TextField
              label="Search contest"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                minWidth: 220,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#f8fafc',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#f8fafc',
                },
                '& .MuiInputLabel-root': {
                  color: '#cbd5e1',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fbbf24',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148, 163, 184, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fbbf24',
                },
              }}
            />

            <Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              size="small"
              displayEmpty
              renderValue={(selected) => selected || 'All'}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 16px 32px rgba(2, 6, 23, 0.7)',
                    borderRadius: 2,
                  },
                },
                MenuListProps: {
                  sx: {
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    padding: 0,
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#0f172a',
                      color: '#f8fafc',
                      '&:hover': {
                        backgroundColor: 'rgba(148, 163, 184, 0.18)',
                        color: '#f8fafc',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(251, 191, 36, 0.12)',
                        color: '#fbbf24',
                      },
                      '&.Mui-focusVisible': {
                        backgroundColor: 'rgba(148, 163, 184, 0.12)',
                        color: '#f8fafc',
                      },
                    },
                  },
                },
              }}
              sx={{
                minWidth: 170,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                color: '#f8fafc',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148, 163, 184, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fbbf24',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fbbf24',
                  boxShadow: '0 0 0 1px rgba(251, 191, 36, 0.28)',
                },
                '& .MuiSelect-select': {
                  color: '#f8fafc',
                  backgroundColor: 'transparent',
                },
                '& .MuiSelect-icon': {
                  color: '#fbbf24',
                },
              }}
            >
              {PLATFORM_OPTIONS.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                  sx={{
                    color: '#f8fafc',
                    backgroundColor: '#0f172a',
                    '&:hover': {
                      backgroundColor: 'rgba(148, 163, 184, 0.18)',
                      color: '#f8fafc',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(251, 191, 36, 0.12)',
                      color: '#fbbf24',
                    },
                    '&.Mui-focusVisible': {
                      backgroundColor: 'rgba(148, 163, 184, 0.12)',
                      color: '#f8fafc',
                    },
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              onClick={() => {
                setSearchText('');
                setPlatformFilter('All');
                setPage(0);
              }}
              sx={{
                background: '#fbbf24',
                color: '#111827',
                fontWeight: 800,
                borderRadius: 2,
                '&:hover': { background: '#facc15' },
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <Paper elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 620 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ background: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', fontWeight: 800 }}>Platform</TableCell>
                  <TableCell sx={{ background: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', fontWeight: 800 }}>Contest</TableCell>
                  <TableCell
                    sx={{ background: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', fontWeight: 800, cursor: 'pointer' }}
                    onClick={() => handleSort('start')}
                  >
                    <TableSortLabel
                      active={sortColumn === 'start'}
                      direction={sortColumn === 'start' ? sortDirection : 'asc'}
                      sx={{ color: '#fbbf24' }}
                    >
                      Start
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{ background: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', fontWeight: 800, cursor: 'pointer' }}
                    onClick={() => handleSort('end')}
                  >
                    <TableSortLabel
                      active={sortColumn === 'end'}
                      direction={sortColumn === 'end' ? sortDirection : 'asc'}
                      sx={{ color: '#fbbf24' }}
                    >
                      End
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ background: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', fontWeight: 800 }}>Difficulty</TableCell>
                </TableRow>
              </TableHead>

              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <CircularProgress size={22} sx={{ color: '#fbbf24' }} />
                        Loading contests...
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : error ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: '#fecaca' }}>
                      {error}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {paginatedRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: '#cbd5e1' }}>
                        No contests match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRows.map((row) => {
                      const difficultyLabel = row.difficulty && row.difficulty !== 'N/A'
                        ? row.difficulty
                        : getContestDifficulty(row.platformLabel, row.name);

                      return (
                        <TableRow
                          key={`${row.platformLabel}-${row.name}-${row.start || row.url}`}
                          hover
                          onClick={() => row.url && window.open(row.url, '_blank', 'noopener,noreferrer')}
                          sx={{ cursor: row.url ? 'pointer' : 'default', transition: 'background 0.2s ease' }}
                        >
                          <TableCell>
                            <span style={{
                              color: getPlatformColor(row.platformLabel),
                              fontWeight: 800,
                              letterSpacing: '0.02em',
                            }}>
                              {row.platformLabel}
                            </span>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#f8fafc' }}>{row.name}</TableCell>
                          <TableCell sx={{ color: '#cbd5e1' }}>{formatDate(row.start)}</TableCell>
                          <TableCell sx={{ color: '#cbd5e1' }}>{formatDate(row.end)}</TableCell>
                          <TableCell>
                            <span style={{
                              display: 'inline-flex',
                              padding: '6px 10px',
                              borderRadius: 999,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: 'rgba(251, 191, 36, 0.14)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.22)',
                            }}>
                              {difficultyLabel}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>

          {!loading && !error && filteredRows.length > 0 && (
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
            />
          )}
        </Paper>
      </div>
    </div>
  );
}

export default Contests;

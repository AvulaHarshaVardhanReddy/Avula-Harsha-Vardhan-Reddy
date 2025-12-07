import React, { useEffect, useState } from 'react';
import { fetchSales, fetchMeta } from './services/api';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Sorting from './components/Sorting';
import Table from './components/Table';

export default function App() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ region: [], gender: [], ageMin: '', ageMax: '' });
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], total: 0, pageSize: 10 });
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetchMeta().then(r => setMeta(r.data)).catch(() => setMeta({}));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(), 250);
    return () => clearTimeout(timeout);
  }, [search, filters, sort, page]);

  const load = async () => {
    const params = {
      search: search || undefined,
      region: (filters.region || []).join(','),
      gender: (filters.gender || []).join(','),
      ageMin: filters.ageMin || undefined,
      ageMax: filters.ageMax || undefined,
      sort: sort || undefined,
      page,
    };

    try {
      const res = await fetchSales(params);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ data: [], total: 0, pageSize: 10 });
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2>Retail Sales Management</h2>
      <div style={{ marginBottom: 12 }}>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Filters filters={filters} setFilters={setFilters} meta={meta} />
        <Sorting sort={sort} setSort={setSort} />
      </div>

      <Table data={result.data} />

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Showing {result.data.length} of {result.total}</div>
        <div>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ marginRight: 8 }}>Prev</button>
          <button disabled={result.data.length < result.pageSize} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

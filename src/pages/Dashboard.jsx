import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import DataTable from '../components/DataTable';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/customers/list').then(response => {
      setData(response.data);
      setOriginalData(response.data);
    });
  }, []);

  const handleSave = () => {
    const changes = data.filter((row, index) => JSON.stringify(row) !== JSON.stringify(originalData[index]));
    if (changes.length > 0 || deletedRows.length > 0) {
      axios.post('http://localhost:8080/api/customers/batch', {
        updateRequests: changes.map(({ customerId, customerName, customerCity }) => ({
          customerId,
          customerName,
          customerCity,
        })),
        deleteRequests: deletedRows,
      }).then(() => {
        setOriginalData(data);
        setDeletedRows([]);
        alert('Data saved successfully!');
        window.location.reload();
      });
    } else {
      alert('No changes to save.');
    }
  };

  const handleDelete = (id) => {
    setDeletedRows(prev => [...prev, id]);
    setData(data.filter(row => row.customerId !== id));
  };
  return (
    <div>
      <h1>Customers Table</h1>
      <Button variant="contained" color="success" onClick={handleSave} sx={{marginBottom:'2vh'}}>
        Save Data
      </Button>
      <DataTable data={data} setData={setData} handleDelete={handleDelete} />
    </div>
  );
}

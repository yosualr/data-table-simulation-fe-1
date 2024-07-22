import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import DataTable from '../components/DataTable';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/customers/list').then(response => {
      setData(response.data);
      setOriginalData(response.data);
    });
  }, []);

  const handleSave = (changes, deletedRows) => {
    setIsSaving(true);
    setSaveMessage('Saving changes...');
    axios.post('http://localhost:8080/api/customers/batch', {
      updateRequests: changes.map(({ customerId, customerName, customerCity }) => ({
        customerId,
        customerName,
        customerCity,
      })),
      deleteRequests: deletedRows,
    }).then(response => {
      axios.get('http://localhost:8080/api/customers/list').then(response => {
        setData(response.data);
        setOriginalData(response.data);
      });
      setIsSaving(false);
      setSaveMessage('Changes saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
      }, 2000);
    });
  };

  const handleDelete = (id) => {
    setDeletedRows(prev => [...prev, id]);
    setData(data.filter(row => row.customerId !== id));
  };

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ margin: "15px" }}>Customers Table</Typography>
        {saveMessage && (
          <Typography variant="body2" color={isSaving ? "textSecondary" : "primary"} sx={{ marginRight: '2vw' }}>
            {saveMessage}
          </Typography>
        )}
      </Box>
      <DataTable data={data} setData={setData} handleDelete={handleDelete} handleSave={handleSave} />
    </div>
  );
}

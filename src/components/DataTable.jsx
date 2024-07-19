import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = ({ data, setData, handleDelete }) => {
  const [newRowCount, setNewRowCount] = useState(0);
  const [IdRow, setIdRow] = useState();

  const columns = [
    { field: 'customerId', headerName: 'ID', width: 250, editable: false },
    { field: 'customerName', headerName: 'Name', width: 400, editable: true },
    { field: 'customerCity', headerName: 'City', width: 400, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.customerId)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const processRowUpdate = (newRow, oldRow) => {
    const updatedData = data.map(row => (row.customerId === newRow.customerId ? newRow : row));
    setData(updatedData);
    return newRow;
  };

  const handleAddNewRow = () => {
    const newRow = {
      customerId: Date.now(), //Temporary ID
      customerName: '',
      customerCity: '',
    };
    setData(prevData => [...prevData, newRow]);
    setNewRowCount(prevCount => prevCount + 1);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.customerId}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Box mt={2}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleAddNewRow}
        >
          + Create New Data
        </Button>
      </Box>
    </div>
  );
};

export default DataTable;

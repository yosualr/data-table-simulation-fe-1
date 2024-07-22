import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

const DataTable = ({ data, setData, handleDelete, handleSave }) => {
  const [editRowsModel, setEditRowsModel] = useState({});
  const [changes, setChanges] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [newRowCount, setNewRowCount] = useState(0);

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
          onClick={() => {
            handleDelete(params.row.customerId);
            setDeletedRows(prev => [...prev, params.row.customerId]);
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const processRowUpdate = (newRow, oldRow) => {
    const updatedData = data.map(row => (row.customerId === newRow.customerId ? newRow : row));
    setData(updatedData);

    // Track changes
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      const existingChangeIndex = changes.findIndex(change => change.customerId === newRow.customerId);
      if (existingChangeIndex !== -1) {
        const updatedChanges = [...changes];
        updatedChanges[existingChangeIndex] = newRow;
        setChanges(updatedChanges);
      } else {
        setChanges(prevChanges => [...prevChanges, newRow]);
      }
    }

    return newRow;
  };

  const handleEditRowsModelChange = (model) => {
    setEditRowsModel(model);
  };

  const handleAddNewRow = () => {
    const newRow = {
      customerId: Date.now(), // Temporary ID
      customerName: '',
      customerCity: '',
    };
    setData(prevData => [...prevData, newRow]);
    setNewRowCount(prevCount => prevCount + 1);
  };

  // Debounce autosave
  const debouncedSave = _.debounce(() => {
    if (changes.length > 0 || deletedRows.length > 0) {
      handleSave(changes, deletedRows);
      setChanges([]);
      setDeletedRows([]);
    }
  }, 500);

  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [changes, deletedRows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        processRowUpdate={processRowUpdate}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        getRowId={(row) => row.customerId}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Button variant="contained" color="primary" onClick={handleAddNewRow} sx={{ margin: "15px" }}>
        + Create New Data
      </Button>
    </div>
  );
};

export default DataTable;

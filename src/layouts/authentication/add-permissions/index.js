import React, { useState, useEffect } from 'react';
import { useFetchPermissionsQuery, useCreateGroupWithPermissionsMutation } from 'api/auth/permissionApi';
import { Card, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

const PermissionsTable = () => {
    const { data: permissions = [], isLoading, error } = useFetchPermissionsQuery();
    const [permissionState, setPermissionState] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [groupName, setGroupName] = useState('');
    const [createGroupWithPermissions, { isLoading: isCreatingGroup, error: groupCreationError }] = useCreateGroupWithPermissionsMutation();

    useEffect(() => {
        if (permissions.length > 0) {
            const initialState = {};
            permissions.forEach((perm) => {
                initialState[perm.name] = {
                    isAdd: perm.isAdd,
                    isView: perm.isView,
                    isChange: perm.isChange,
                    isDelete: perm.isDelete,
                };
            });
            setPermissionState(initialState);
        }
    }, [permissions]);

    const handleCheckboxChange = (name, action) => {
        setPermissionState((prevState) => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                [action]: !prevState[name][action],
            },
        }));
    };

    const handleSubmit = () => {
        const permissionsArray = Object.keys(permissionState).map((role) => ({
            role,
            permissions: {
                isAdd: permissionState[role].isAdd,
                isView: permissionState[role].isView,
                isChange: permissionState[role].isChange,
                isDelete: permissionState[role].isDelete,
            },
            // Assuming you need the 'id' field for each permission, fetched from the permissions data
            id: permissions.find((perm) => perm.name === role)?.id,  // Get the 'id' of each permission
        }));

        // Create the group with selected permissions
        createGroupWithPermissions({ name: groupName, permissions: permissionsArray });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPermissions = permissions.filter((perm) =>
        perm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: 'srNo', headerName: 'Sr. No.', flex: 0.5, headerAlign: 'center' },
        { field: 'role', headerName: 'Role', flex: 1, headerAlign: 'center' },
        {
            field: 'add',
            headerName: 'Add',
            flex: 0.5,
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={permissionState[params.row.role]?.isAdd || false}
                    onChange={() => handleCheckboxChange(params.row.role, 'isAdd')}
                />
            ),
        },
        {
            field: 'view',
            headerName: 'View',
            flex: 0.5,
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={permissionState[params.row.role]?.isView || false}
                    onChange={() => handleCheckboxChange(params.row.role, 'isView')}
                />
            ),
        },
        {
            field: 'update',
            headerName: 'Update',
            flex: 0.5,
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={permissionState[params.row.role]?.isChange || false}
                    onChange={() => handleCheckboxChange(params.row.role, 'isChange')}
                />
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 0.5,
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={permissionState[params.row.role]?.isDelete || false}
                    onChange={() => handleCheckboxChange(params.row.role, 'isDelete')}
                />
            ),
        },
    ];

    const rows = filteredPermissions.map((permission, index) => ({
        id: index,
        srNo: index + 1,
        role: permission.name,
    }));

    if (isLoading) return <div>Loading permissions...</div>;
    if (error) return <div>Error loading permissions: {error.message}</div>;

    return (
        <MDBox p={3}>
            <Card sx={{ maxWidth: '80%', mx: 'auto', mt: 3 }}>
                <MDBox p={3} display="flex" alignItems="center">
                    <MDInput
                        label="Search Permissions"
                        variant="outlined"
                        size="small"
                        sx={{ width: '250px', mr: 2 }}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Roles & Permissions
                    </MDTypography>
                    <MDButton variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
                        Submit
                    </MDButton>
                </MDBox>
                {/* Roles Text Box Added Below Heading and Buttons */}
                <MDBox display="flex" justifyContent="flex-start" sx={{ mt: 2, mb: 2, ml: 3 }}>
                    <MDInput
                        label="Roles"
                        variant="outlined"
                        size="small"
                        sx={{ width: '250px' }}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </MDBox>
                <MDBox display="flex" justifyContent="center" p={2}>
                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                '& .MuiDataGrid-columnHeaders': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-cell': {
                                    textAlign: 'center',
                                },
                            }}
                        />
                    </div>
                </MDBox>
            </Card>
        </MDBox>
    );
};

export default PermissionsTable;

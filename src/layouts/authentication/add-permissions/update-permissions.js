import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFetchPermissionsByGroupIdQuery, useUpdateGroupPermissionsMutation } from 'api/auth/permissionApi';
import { useAuth } from 'hooks/use-auth'; // Import useAuth for dynamic groupId
import { Card, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

const UpdatePermissionsTable = () => {
    const { role: groupId } = useAuth(); // Fetch groupId dynamically from useAuth
    const { data: groupPermissions = {}, isLoading, error } = useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
        skip: !groupId, // Skip fetching if groupId is not available
    });

    const [permissionState, setPermissionState] = useState({});
    const [groupName, setGroupName] = useState('');
    const [updateGroupPermissions, { isLoading: isUpdating }] = useUpdateGroupPermissionsMutation();

    useEffect(() => {
        if (groupPermissions.permissions && groupPermissions.name) {
            const initialState = {};
            groupPermissions.permissions.forEach((perm) => {
                initialState[perm.name] = {
                    isAdd: perm.isAdd,
                    isView: perm.isView,
                    isChange: perm.isChange,
                    isDelete: perm.isDelete,
                    addId: perm.addId,
                    viewId: perm.viewId,
                    changeId: perm.changeId,
                    deleteId: perm.deleteId,
                };
            });
            setPermissionState(initialState);
            setGroupName(groupPermissions.name);
        }
    }, [groupPermissions]);

    const handleCheckboxChange = (role, action) => {
        setPermissionState((prevState) => ({
            ...prevState,
            [role]: {
                ...prevState[role],
                [action]: !prevState[role][action],
            },
        }));
    };

    const handleSubmit = () => {
        const selectedPermissionIds = Object.keys(permissionState).map((role) => {
            const perm = permissionState[role];
            const selectedIds = [];
            if (perm.isAdd) selectedIds.push(perm.addId);
            if (perm.isView) selectedIds.push(perm.viewId);
            if (perm.isChange) selectedIds.push(perm.changeId);
            if (perm.isDelete) selectedIds.push(perm.deleteId);
            return selectedIds;
        }).flat();

        const payload = {
            groupId,
            name: groupName,
            permissions: selectedPermissionIds,
        };

        updateGroupPermissions(payload)
            .unwrap()
            .then((response) => {
                console.log('Group updated successfully:', response);
            })
            .catch((error) => {
                console.error('Error updating group:', error);
            });
    };

    const columns = [
        { field: 'srNo', headerName: 'Sr. No.', flex: 0.5, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Role', flex: 1, headerAlign: 'center', align: 'center' },
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
            align: 'center',
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
            align: 'center',
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
            align: 'center',
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
            align: 'center',
        },
    ];

    const rows = Object.keys(permissionState).map((role, index) => ({
        id: index,
        srNo: index + 1,
        role,
    }));

    if (!groupId) return <div>No group selected. Please log in.</div>;
    if (isLoading) return <div>Loading permissions...</div>;
    if (error) return <div>Error loading permissions: {error.message}</div>;

    return (
        <MDBox p={3}>
  <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: 'auto', marginRight: 0 }}>
                <MDBox p={3} display="flex" alignItems="center">
                    <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Update Roles & Permissions
                    </MDTypography>
                    <MDButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ ml: 2 }}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </MDButton>
                </MDBox>
                <MDBox display="flex" justifyContent="flex-start" sx={{ mt: 2, mb: 2, ml: 3 }}>
                    <MDInput
                        label="Group Name"
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
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-cell': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            }}
                        />
                    </div>
                </MDBox>
            </Card>
        </MDBox>
    );
};

export default UpdatePermissionsTable;

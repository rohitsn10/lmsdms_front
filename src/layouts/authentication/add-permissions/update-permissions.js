import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Add PropTypes import
import { useFetchPermissionsQuery, useCreateGroupWithPermissionsMutation, useFetchPermissionsByGroupIdQuery } from 'api/auth/permissionApi'; // Use `useFetchPermissionsByGroupIdQuery` instead of `useGetGroupPermissionsQuery`
import { Card, Checkbox, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

const PermissionsUpdate = ({ groupId }) => {
    const { data: permissions = [], isLoading, error } = useFetchPermissionsQuery();
    const { data: groupPermissions, isLoading: isGroupLoading, error: groupError } = useFetchPermissionsByGroupIdQuery(groupId); // Using `useFetchPermissionsByGroupIdQuery`
    const [permissionState, setPermissionState] = useState({});
    const [groupName, setGroupName] = useState('');
    const [updateGroupPermissions, { isLoading: isUpdating, error: updateError }] = useCreateGroupWithPermissionsMutation();

    useEffect(() => {
        if (permissions.length > 0) {
            const initialState = {};
            permissions.forEach((perm) => {
                const groupPermission = groupPermissions?.data.find(gp => gp.name === perm.name) || {};
                initialState[perm.name] = {
                    isAdd: groupPermission.isAdd || false,
                    isView: groupPermission.isView || false,
                    isChange: groupPermission.isChange || false,
                    isDelete: groupPermission.isDelete || false,
                    addId: perm.add,
                    viewId: perm.view,
                    changeId: perm.change,
                    deleteId: perm.delete,
                };
            });
            setPermissionState(initialState);
            setGroupName(groupPermissions?.data?.[0]?.groupName || ''); // Adjust group name if needed
        }
    }, [permissions, groupPermissions]);

    const handleCheckboxChange = (name, action) => {
        setPermissionState((prevState) => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                [action]: !prevState[name][action], // Toggle the checkbox state
            },
        }));
    };

    const handleSubmit = () => {
        console.log('Permission State before submission:', permissionState);

        // Create an array of selected permission IDs
        const selectedPermissionIds = Object.keys(permissionState)
            .map((role) => {
                const perm = permissionState[role];
                const selectedIds = [];
                if (perm.isAdd) selectedIds.push(perm.addId);
                if (perm.isView) selectedIds.push(perm.viewId);
                if (perm.isChange) selectedIds.push(perm.changeId);
                if (perm.isDelete) selectedIds.push(perm.deleteId);
                return selectedIds;
            })
            .flat(); // Flatten the array to get a single list of IDs

        const payload = {
            name: groupName,
            permissions: selectedPermissionIds,
        };

        console.log('Payload to submit:', payload);

        updateGroupPermissions(payload)
            .unwrap()
            .then((response) => {
                console.log('Group permissions updated successfully:', response);
            })
            .catch((error) => {
                console.error('Error updating group permissions:', error);
            });
    };

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

    const rows = permissions.map((permission, index) => ({
        id: index,
        srNo: index + 1,
        role: permission.name,
    }));

    if (isLoading || isGroupLoading) return <div>Loading permissions...</div>;
    if (error || groupError) return <div>Error loading permissions: {error?.message || groupError?.message}</div>;

    return (
        <MDBox p={3}>
            <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3 }}>
                <MDBox p={3} display="flex" alignItems="center">
                    <MDInput
                        label="Search Permissions"
                        variant="outlined"
                        size="small"
                        sx={{ width: '250px', mr: 2 }}
                    />
                    <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Update Roles & Permissions
                    </MDTypography>
                    <MDButton variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
                        Update
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
                            }}
                        />
                    </div>
                </MDBox>
            </Card>
        </MDBox>
    );
};

// Add PropTypes validation for groupId
PermissionsUpdate.propTypes = {
    groupId: PropTypes.string.isRequired,  // Assuming groupId is a string, adjust if necessary
};

export default PermissionsUpdate;

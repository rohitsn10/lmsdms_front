import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  useFetchPermissionsQuery,
  useFetchPermissionsByGroupIdQuery,
  useUpdateGroupPermissionsMutation,
} from "api/auth/permissionApi"; // Assuming these APIs are exported here
import { Card, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const UpdatePermissionsTable = ({ groupId }) => {
  const { data: permissions = [], isLoading: isPermissionsLoading, error } = useFetchPermissionsQuery();
  const { data: groupPermissions, isLoading: isGroupLoading } = useFetchPermissionsByGroupIdQuery(groupId);
  const [updateGroupPermissions] = useUpdateGroupPermissionsMutation();

  const [permissionState, setPermissionState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  console.log("group id:", groupId)

  // Initialize permissions state
  useEffect(() => {
    if (permissions.length > 0) {
      const initialState = {};
      permissions.forEach((perm) => {
        initialState[perm.name] = {
          isAdd: false,
          isView: false,
          isChange: false,
          isDelete: false,
        };
      });
      setPermissionState(initialState);
    }
  }, [permissions]);

  // Prepopulate permissions state if groupPermissions is available
  useEffect(() => {
    if (groupPermissions) {
      const updatedState = {};
      groupPermissions.forEach((perm) => {
        updatedState[perm.name] = {
          isAdd: perm.isAdd,
          isView: perm.isView,
          isChange: perm.isChange,
          isDelete: perm.isDelete,
        };
      });
      setPermissionState(updatedState);
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

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);

    setPermissionState((prevState) => {
      const updatedState = {};
      Object.keys(prevState).forEach((role) => {
        updatedState[role] = {
          isAdd: newSelectAllState,
          isView: newSelectAllState,
          isChange: newSelectAllState,
          isDelete: newSelectAllState,
        };
      });
      return updatedState;
    });
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required.");
      return;
    }

    const permissionsPayload = Object.keys(permissionState).map((role) => ({
      name: role,
      ...permissionState[role],
    }));

    try {
      const message = await updateGroupPermissions({ group_id: groupId, permissions: permissionsPayload }).unwrap();
      toast.success(message);
    } catch (err) {
      toast.error(err.message || "Failed to update group permissions.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPermissions = permissions.filter((perm) =>
    perm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "srNo", headerName: "Sr. No.", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "role", headerName: "Role", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "add",
      headerName: "Add",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isAdd || false}
          onChange={() => handleCheckboxChange(params.row.role, "isAdd")}
        />
      ),
      align: "center",
    },
    {
      field: "view",
      headerName: "View",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isView || false}
          onChange={() => handleCheckboxChange(params.row.role, "isView")}
        />
      ),
      align: "center",
    },
    {
      field: "update",
      headerName: "Update",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isChange || false}
          onChange={() => handleCheckboxChange(params.row.role, "isChange")}
        />
      ),
      align: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isDelete || false}
          onChange={() => handleCheckboxChange(params.row.role, "isDelete")}
        />
      ),
      align: "center",
    },
  ];

  const rows = filteredPermissions.map((permission, index) => ({
    id: index,
    srNo: index + 1,
    role: permission.name,
  }));

  if (isPermissionsLoading || isGroupLoading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions: {error.message}</div>;

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search Permissions"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Update Roles & Permissions
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleSelectAll} sx={{ ml: 2 }}>
            {selectAll ? "Deselect All" : "Select All"}
          </MDButton>
          <MDButton variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
            Submit
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" sx={{ mt: 2, mb: 2, ml: 3 }}>
          <MDInput
            label="Group Name"
            variant="outlined"
            size="small"
            sx={{ width: "250px" }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </MDBox>
  );
};

// Define PropTypes
UpdatePermissionsTable.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default UpdatePermissionsTable;

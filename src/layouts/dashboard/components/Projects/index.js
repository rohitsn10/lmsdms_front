import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Mock data
const mockData = () => ({
  columns: [
    { Header: "Title", accessor: "title", width: "20%", filter: "text" },
    { Header: "Doc no.", accessor: "doc_no", width: "10%", filter: "text" },
    { Header: "Ver Status", accessor: "ver_status", width: "10%", filter: "text" },
    { Header: "Effective", accessor: "effective", width: "10%", filter: "text" },
    { Header: "Tra.(%)", accessor: "tra", width: "10%", filter: "text" },
    { Header: "Work flow", accessor: "workflow", width: "10%", filter: "text" },
    { Header: "Edit", accessor: "edit", width: "10%" },
    { Header: "Action", accessor: "action", width: "10%" },
  ],
  rows: [
    {
      title: "Document A",
      doc_no: "123",
      ver_status: "Approved",
      effective: "Yes",
      tra: "85%",
      workflow: "In Progress",
      edit: <Icon>edit</Icon>,
      action: <Icon>delete</Icon>,
    },
    {
      title: "Document B",
      doc_no: "124",
      ver_status: "Pending",
      effective: "No",
      tra: "65%",
      workflow: "Not Started",
      edit: <Icon>edit</Icon>,
      action: <Icon>delete</Icon>,
    },
    {
      title: "Document C",
      doc_no: "125",
      ver_status: "Rejected",
      effective: "No",
      tra: "45%",
      workflow: "Completed",
      edit: <Icon>edit</Icon>,
      action: <Icon>delete</Icon>,
    },
    {
      title: "Document D",
      doc_no: "126",
      ver_status: "Approved",
      effective: "Yes",
      tra: "90%",
      workflow: "In Review",
      edit: <Icon>edit</Icon>,
      action: <Icon>delete</Icon>,
    },
    {
      title: "Document E",
      doc_no: "127",
      ver_status: "Pending",
      effective: "No",
      tra: "70%",
      workflow: "In Progress",
      edit: <Icon>edit</Icon>,
      action: <Icon>delete</Icon>,
    },
  ],
});

function Listing() {
  const { columns, rows } = mockData();
  const [menu, setMenu] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    doc_no: "",
    ver_status: "",
    effective: "",
    tra: "",
    workflow: "",
  });

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const handleFilterChange = (e, column) => {
    setFilters({ ...filters, [column]: e.target.value });
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  // Apply filters
  const filteredRows = rows.filter((row) =>
    Object.keys(filters).every((column) => 
      row[column].toString().toLowerCase().includes(filters[column].toLowerCase())
    )
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h4" gutterBottom>
            Listing
          </MDTypography>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>

      {/* Filters */}
      <MDBox display="flex" justifyContent="space-between" p={2}>
        {columns.map((column) => (
          column.filter && (
            <TextField
              key={column.accessor}
              label={column.Header}
              value={filters[column.accessor]}
              onChange={(e) => handleFilterChange(e, column.accessor)}
              variant="outlined"
              size="small"
            />
          )
        ))}
      </MDBox>

      <MDBox>
        <DataTable
          table={{ columns, rows: filteredRows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default Listing;

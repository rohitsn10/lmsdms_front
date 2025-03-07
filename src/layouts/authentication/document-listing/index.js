import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useFetchDocumentsQuery } from "api/auth/documentApi";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PreviewIcon from "@mui/icons-material/Preview";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { hasPermission } from "utils/hasPermission";
import PropTypes from "prop-types";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";
import { useAuth } from "hooks/use-auth";
import moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConditionalDialog from "./effective";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BrowserUpdatedOutlinedIcon from "@mui/icons-material/BrowserUpdatedOutlined";
// import ReviseDialog from "./Revise";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import ChildDocumentsDialog from "./child-document";
import SubtitlesOffIcon from "@mui/icons-material/SubtitlesOff";
import ObsoleteDialog from "./obsolete";
import { useUpdateObsoleteStatusMutation } from "api/auth/documentApi";
import { toast, ToastContainer } from "react-toastify";
import EffectiveDialog from "./effectiveDialog";
import { useDocumentEffectiveMutation } from "api/auth/documentApi";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import ViewSelectionDialog from "./view-user";
const DocumentListing = () => {
  const { user } = useAuth();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, refetch, isLoading, isError } = useFetchDocumentsQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userGroupIds, setUserGroupIds] = useState([]);
  const [isReviseDialogOpen, setReviseDialogOpen] = useState(false); // Unique state for ReviseDialog
  const [reviseDocument, setReviseDocument] = useState(null); // Unique state for selected document
  const [openChildDialog, setOpenChildDialog] = useState(false);
  const [ObsoletedialogOpen, setObsoleteDialogOpen] = useState(false);
  const [selectedChildDocuments, setSelectedChildDocuments] = useState([]);
  const [updateObsoleteStatus] = useUpdateObsoleteStatusMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openviewDialog, setOpenviewDialog] = useState(false);
  console.log("data in document list",data)
  const [documentEffective, { isLoading: isEffecting, isError: isEffectError }] =
    useDocumentEffectiveMutation();
  const version = searchParams.get("version");
  // console.log("Versionnon", version);
  // console.log("Versionnon",version)
  useEffect(() => {
    if (data && data.userGroupIds) {
      setUserGroupIds(data.userGroupIds);
      // console.log("User Group IDssss:", data.userGroupIds); // Corrected property name
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [location.key]);

  // Extract revision_month from data
  const revisionMonth = data?.revision_month;

  const documents = data?.documents || [];

  const { data: userPermissions = [], isError: permissionError } =
    useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
      skip: !groupId,
    });

  const handleDialogOpen = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };
  const handleViewChildDocuments = (row) => {
    setSelectedRow(row);
    setSelectedChildDocuments([]);
    setOpenChildDialog(true);
  };

  const handleViewUsers = (params) => {
    setSelectedRow(params.row);
    setOpenviewDialog(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };
  const handleObsoleteClose = () => {
    setObsoleteDialogOpen(false);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleAddDocument = () => {
    navigate("/add-document");
  };
  const handleObsolete = () => {
    navigate("/Obsolete-data");
  };
  const handleClick = (params) => {
    if (!params || !params.row) {
      console.error("Invalid params object:", params);
      return; // Exit if params or row is missing
    }

    const {
      id,
      document_current_status,
      select_template,
      training_required,
      approval_status,
      version,
    } = params.row;
    // console.log("Version", version);
    // Ensure required fields are defined
    if (
      id === undefined ||
      document_current_status === undefined ||
      training_required === undefined ||
      approval_status === undefined
    ) {
      console.error("Missing data in params.row:", params.row);
      return;
    }
    // console.log("Console.log check for ID:",params?.row?.version)
    navigate(
      `/document-view/${id}?status=${document_current_status}&training_required=${training_required}&approvalstatus=${approval_status}&version=${version}&templateID=${select_template}`
    );
    // console.log("Navigated with:", {
    //   id,
    //   document_current_status,
    //   training_required,
    //   approval_status,
    // });
  };
  const handleReviseDialogOpen = (row) => {
    setSelectedRow(row);
    setReviseDialogOpen(true);
  };

  const handleReviseDialogClose = () => {
    setReviseDialogOpen(false);
    setReviseDocument(null);
  };
  const isButtonVisible = () => {
    return roles.some((role) => role.id === 5);
  };
  const handleReviseConfirm = () => {
    console.log("Revise confirmed for document:", reviseDocument);
    // Add any additional logic here
    handleReviseDialogClose();
  };
  const handleEffectiveClick = (row) => {
    setSelectedRow(row); // Set the row data
    setOpenDialog(true); // Open the dialog
  };
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setSelectedRow(null); // Reset row data
  };
  const handleConfirmEffective = async () => {
    if (selectedRow) {
      try {
        // Call the mutation with the document ID and status
        await documentEffective({
          document: selectedRow.id,
          status: "7", // Pass the status "7" as requested
        }).unwrap(); // unwrap to access the response directly

        // On success, show toast notification
        toast.success(`Document ${selectedRow.document_title} marked as effective!`);
      } catch (error) {
        // On failure, show error toast
        toast.error("Failed to mark the document as effective. Please try again.");
      }
    }

    // Close the dialog after the operation
    handleCloseDialog();
  };
  const handleViewFile = (url,new_url, params) => {
    // navigate("/PreView", { state: { templateDoc: url,new_url:new_url, templateData: params } }); // Pass the URL as state
    navigate("/docviewer",{state:{docId:params.id,templateId:params.select_template
    }})
    // console.log(params)
    // console.log(params.id,params.select_template  )
  };  

  const handleEditClick = (rowData) => {
    navigate("/edit-document", { state: { item: rowData } });
    console.log("Full Row Data passed", rowData);
  };
  const handleObsoleteDialogOpen = (row) => {
    setSelectedRow(row);
    setObsoleteDialogOpen(true);
  };
  const handleObsoleteConfirm = async (documentId) => {
    try {
      await updateObsoleteStatus({
        document_id: documentId,
        status: "12",
      });
      toast.success("Document marked as obsolete successfully!");
      setObsoleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to mark the document as obsolete. Please try again.");
    }
  };

  const filteredData = documents.filter(
    (doc) =>
      (doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.created_at.toLowerCase().includes(searchTerm.toLowerCase())) &&
      doc.document_current_status !== 12
  );

  const rows = filteredData.map((doc, index) => ({
    ...doc,
    index,
    created_at: doc.created_at ? moment(doc.created_at).format("DD/MM/YY") : "N/A",
    effective_date: doc.effective_date ? moment(doc.effective_date).format("DD/MM/YY") : "N/A",
    revision_date: doc.revision_date ? moment(doc.revision_date).format("DD/MM/YY") : "N/A",
  }));

  const columns = [
    {
      field: "index",
      headerName: "Sr.No.",
      flex: 0.3,
      headerAlign: "center",
      renderCell: (params) => <span>{params.row.index + 1}</span>,
      sortable: false,
      filterable: false,
    },
    {
      field: "document_title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "document_type_name",
      headerName: "Type",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "sop_icon",
      headerName: "SOP Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => {
        const isSOP = params.row.document_type_name === "SOP";
        return (
          <MDBox display="flex" justifyContent="center">
            <IconButton
              color="success"
              onClick={() => handleViewChildDocuments(params.row)}
              disabled={!isSOP} // Disable if document type is not SOP
            >
              <FolderSharedOutlinedIcon /> {/* Replace with the desired icon */}
            </IconButton>
          </MDBox>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "document_number",
      headerName: "Document No.",
      flex: 0.55,
      headerAlign: "center",
    },
    {
      field: "version",
      headerName: "Version",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "current_status_name",
      headerName: "Status",
      flex: 0.6,
      headerAlign: "center",
      renderCell: (params) => {
        // Check for the specific condition: is_done is true and current_status_name is "Under Reviewer"
        // console.log("Print params:::",params);
        if ((params.row.is_done === false || params.row.is_done === null)  && params.row.document_current_status == 8) {
          return <span>Under Reviewer</span>
        }
        // Otherwise, display the original current_status_name
        return <span>{params.row.current_status_name}</span>;
      }
    },
    {
      field: "view_Users",
      headerName: "View Users",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <MDBox display="flex" justifyContent="center">
            <IconButton color="default" onClick={() => handleViewUsers(params)}>
              <HowToRegTwoToneIcon />
            </IconButton>
          </MDBox>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "effective_date",
      headerName: "Effective Date",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "revision_date",
      headerName: "Revision Date",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.9,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          {hasPermission(userPermissions, "document", "isChange") && (
            <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            color="primary"
            onClick={() => {
              handleViewFile(
                params.row.selected_template_url,
                params.row.front_file_url,
                params.row
              );
              // console.log()
              console.log("Params",params.row)
            }}
          >
            <VisibilityIcon />
          </IconButton>
          {params.row.form_status === "save_draft"
            ? hasPermission(userPermissions, "document", "isView") && (
                <IconButton
                  color="secondary"
                  // onClick={() => {
                  //   console.log("Params passed to handleClick:", params.row);
                  // }}
                >
                  <PreviewIcon />
                </IconButton>
              )
            : hasPermission(userPermissions, "document", "isView") &&
              params.row.current_status_name !== "Release" && 
              !(groupId === 3 && params.row.current_status_name == "Under Approver" || params.row.current_status_name == "Effective" ) &&
               ( // Hide if status is "Approve"
                <IconButton color="inherit" onClick={() => handleClick(params)}>
                  <EditCalendarIcon />
                </IconButton>
              )}
          {groupId===5 && ( 
            <IconButton
              color="success"
              onClick={() => handleDialogOpen(params.row)}
              disabled={params.row.document_current_status !== 9} 
            >
              <CheckCircleIcon />
            </IconButton>
          )}
          {/* {params.row.document_current_status === 7 && ( // Show ImportContactsTwoToneIcon when status is 7
            <IconButton
              color="warning"
              onClick={() => handleReviseDialogOpen(params.row)}
            >
              <ImportContactsTwoToneIcon />
            </IconButton>
          )} */}
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "preview_download",
      headerName: "Download",
      flex: 0.4,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="block">
          <IconButton
            color="primary"
            onClick={() => {
              navigate("/PDFPreview", {
                state: {
                  documentId: params.row.id,
                },
              });
            }}
            // disabled={params.row.document_current_status !== 9}
          >
            <BrowserUpdatedOutlinedIcon />
          </IconButton>
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
    ...(groupId === 5
      ? [
          {
            field: "obsolete",
            headerName: "Obsolete",
            flex: 0.4,
            headerAlign: "center",
            renderCell: (params) => (
              <MDBox display="block">
                <IconButton
                  color="warning"
                  onClick={() => {
                    // Open ObsoleteDialog with row data (pass document_title)
                    handleObsoleteDialogOpen(params.row);
                  }}
                >
                  <SubtitlesOffIcon />
                </IconButton>
              </MDBox>
            ),
            sortable: false,
            filterable: false,
          },
        ]
      : []),
    ...(groupId === 5
      ? [
          {
            field: "effective", // New column added
            headerName: "Effective", // Column name
            flex: 0.4, // Adjust the flex based on your layout needs
            headerAlign: "center", // Center-align header
            renderCell: (params) => (
              <MDBox display="flex" justifyContent="center">
                <IconButton
                  color="primary"
                  onClick={() => handleEffectiveClick(params.row)} // Open dialog when clicked
                >
                  <CheckCircleIcon /> {/* Example icon for 'Effective' */}
                </IconButton>
              </MDBox>
            ),
            sortable: false,
            filterable: false,
          },
        ]
      : []),
  ];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching documents.</div>;
  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Document Listing
          </MDTypography>
          {groupId === 5 && (
            <MDButton variant="contained" color="primary" onClick={handleObsolete} sx={{ ml: 2 }}>
              Obsolete
            </MDButton>
          )}

          {hasPermission(userPermissions, "document", "isAdd") && (
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleAddDocument}
              sx={{ ml: 2 }}
            >
              Add Document
            </MDButton>
          )}
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%", overflow: "auto" }}>
            <DataGrid
              rows={rows || []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                minWidth: 1500,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  textAlign: "center",
                  width: "100%",
                },
              }}
            />
          </div>
          {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        </MDBox>
      </Card>
      <ConditionalDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={() => console.log("Confirmed for row:", selectedRow)}
        trainingStatus={selectedRow?.training_required || "false"}
        documentId={selectedRow?.id || ""}
        revisionMonth={selectedRow?.revision_month}
      />
      <ChildDocumentsDialog
        open={openChildDialog}
        onClose={() => setOpenChildDialog(false)}
        documentId={selectedRow?.id || ""}
      />
      <ObsoleteDialog
        open={ObsoletedialogOpen}
        onClose={handleObsoleteClose}
        onConfirm={handleObsoleteConfirm}
        documentTitle={selectedRow?.document_title || "Unknown Document"} // Pass document_title here
        documentId={selectedRow?.id || ""}
      />
      <EffectiveDialog
        openDialog={openDialog}
        selectedRow={selectedRow}
        handleCloseDialog={handleCloseDialog}
        handleConfirmEffective={handleConfirmEffective}
      />
      <ViewSelectionDialog
        open={openviewDialog}
        onClose={() => setOpenviewDialog(false)}
        documentId={selectedRow?.id || ""}
      />
      {/* <ReviseDialog
  open={isReviseDialogOpen}
  onClose={() => setReviseDialogOpen(false)}
  onConfirm={handleReviseConfirm}
  documentId={selectedRow?.id|| ""} 
  // You can pass more fields like selectedRow or row as needed
/> */}
    </MDBox>
  );
};

DocumentListing.propTypes = {
  userPermissions: PropTypes.arrayOf(
    PropTypes.shape({
      resource: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentListing;

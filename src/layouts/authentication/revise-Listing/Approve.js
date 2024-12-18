import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useApproveReviseMutation } from "api/auth/reviseApi";  // Adjust the import path to your API file

const ReviseApproveDialog = ({ open, onClose, onApprove, onReject, row }) => {
    const [reason, setReason] = useState("");
    
    // Call the approveRevise mutation hook
    const [approveRevise, { isLoading, isError, isSuccess }] = useApproveReviseMutation();

    // Log the entire row to ensure it's passed correctly
    useEffect(() => {
        // console.log("Row data passed to dialog:", row);

        if (row) {
            const document_id = row?.id; // Assuming id is the document_id
            const revise_description = row?.revisereason; // Assuming revisereason is the revise_description
            const revise_request_id = row?.id; // Using id as revise_request_id (if applicable)
            setReason(revise_description || "");
        } else {
            console.log("Row data is not available yet.");
        }
    }, [row]); // Only run the effect when the `row` prop changes

    const handleApprove = async () => {
        console.log("Approving with reason:", reason);
        try {
            await approveRevise({
                document_id: row?.id,
                status_id: 10, // Assuming 1 is the 'approved' status, adjust as needed
                request_action_id: row?.id, // Assuming you have a request action ID to send
                action_status: "approved",
            }).unwrap(); // `unwrap` to handle response or error directly
            onApprove(reason, row?.id, row?.id);
            onClose();
        } catch (error) {
            console.error("Error approving revise:", error);
        }
    };

    const handleReject = async () => {
        console.log("Rejecting with reason:", reason);
        try {
            await approveRevise({
                document_id: row?.id,
                status_id: 7, // Assuming 2 is the 'rejected' status, adjust as needed
                request_action_id: row?.id, // Same assumption for action ID
                action_status: "rejected",
            }).unwrap(); // `unwrap` to handle response or error directly
            onReject(reason, row?.id, row?.id);
            onClose();
        } catch (error) {
            console.error("Error rejecting revise:", error);
        }
    };

    // Return the dialog UI only when row is available
    if (!row) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <MDBox sx={{ textAlign: "center" }}>
                <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
                    Revise Approve
                </MDTypography>
            </MDBox>

            <form onSubmit={(e) => e.preventDefault()}>
                <DialogContent>
                    <MDBox sx={{ marginTop: 2, textAlign: "center" }}>
                        <TextField
                            fullWidth
                            label="Reason"
                            variant="outlined"
                            value={reason}
                            InputProps={{
                                readOnly: true,
                            }}
                            multiline
                            rows={3}
                            required
                        />
                    </MDBox>
                </DialogContent>

                <DialogActions>
                    <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
                        Cancel
                    </MDButton>
                    <MDBox sx={{ display: "flex", gap: 2 }}>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={handleApprove}
                            disabled={isLoading} // Disable when loading
                        >
                            Approve
                        </MDButton>

                        <MDButton
                            variant="gradient"
                            color="warning"
                            onClick={handleReject}
                            disabled={isLoading} // Disable when loading
                        >
                            Reject
                        </MDButton>
                    </MDBox>
                </DialogActions>
            </form>
        </Dialog>
    );
};

ReviseApproveDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    row: PropTypes.shape({
        id: PropTypes.number.isRequired, // assuming this is document_id
        documentTitle: PropTypes.string.isRequired,
        revisereason: PropTypes.string, // assuming this is the revise_description
        reviseStatus: PropTypes.string,
        requestedUser: PropTypes.string,
        serial_number: PropTypes.number,
    }).isRequired,
};

export default ReviseApproveDialog;

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, AppBar, Toolbar } from "@mui/material";
import { useAuth } from "hooks/use-auth";
import { useCompleteViewDocumentMutation } from "apilms/trainingApi";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

const TrainingDocumentObsoleteView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { docId: document_id, templateId,front_file_url } = location.state || {};
  console.log("HEre comes::::",front_file_url)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorConfig, setEditorConfig] = useState(null);
  const docEditorRef = useRef(null);
  const [completeViewDocument] = useCompleteViewDocumentMutation();

  useEffect(() => {
    if (front_file_url) {
      fetchEditorConfig();
    } else {
      setError("File Url is missing");
      setLoading(false);
    }
  }, [front_file_url]);

  const fetchEditorConfig = async () => {
    const apiUrl = process.env.REACT_APP_APIKEY;
    try {
      // http://127.0.0.1:8000/dms_module/get_editor_config_for_obsolete_doc?front_file_url=http://127.0.0.1:8000/media/templates/Cobra_4.docx
      const response = await fetch(`${apiUrl}dms_module/get_editor_config_for_obsolete_doc?front_file_url=${front_file_url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch ONLYOFFICE configuration");
      const config = await response.json();
      setEditorConfig(config);
    } catch (fetchError) {
      setError("Failed to fetch ONLYOFFICE configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorConfig) {
      const script = document.createElement("script");
      script.src = process.env.REACT_APP_ONLYOFFICE_SCRIPT;
      script.onload = () => {
        try {
          docEditorRef.current = new window.DocsAPI.DocEditor("onlyoffice-editor-container", {
            width: "100%",
            height: "100%",
            type: "desktop",
            document: editorConfig.document,
            editorConfig: {
              mode: "view",
              callbackUrl: editorConfig.callbackUrl,
              user: { id: user?.id, name: user?.first_name },
            },
            token: editorConfig.token,
          });
        } catch (error) {
          setError("Failed to initialize ONLYOFFICE editor");
        }
      };
      script.onerror = () => setError("Failed to load ONLYOFFICE script");
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
        docEditorRef.current = null;
      };
    }
  }, [editorConfig, user]);

  if (loading || error) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading ? <CircularProgress /> : <Typography color="error">{error}</Typography>}
      </Box>
    );
  }

  return (
    <MDBox
      sx={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">Obsolete Document View</Typography>
          <MDButton variant="contained" color="primary" onClick={() => navigate("/trainingListing")}>Go Back</MDButton>
        </Toolbar>
      </AppBar>
      <Box id="onlyoffice-editor-container" sx={{ flex: 1, backgroundColor: "#fff" }} />
    </MDBox>
  );
};

export default TrainingDocumentObsoleteView;

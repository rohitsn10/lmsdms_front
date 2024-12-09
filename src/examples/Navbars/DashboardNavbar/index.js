// src/components/DashboardNavbar.js
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

// Material-UI core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MDButton from "components/MDButton";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";

// Custom components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Breadcrumbs from "examples/Breadcrumbs";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { useAuth } from "hooks/use-auth";

// Import the API hook for switching roles
import { useRequestUserGroupListQuery, useUserSwitchRoleMutation } from "api/auth/switchRoleApi";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const { user, role } = useAuth();
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Fetch roles using the API hook
  const { data: rolesData, isLoading, isError } = useRequestUserGroupListQuery();
  
  // Initialize the switch role mutation
  const [userSwitchRole, { isLoading: isSwitchLoading, isError: isSwitchError, data: switchData, error: switchError }] = useUserSwitchRoleMutation();

  useEffect(() => {
    if (isLoading) {
      console.log("Loading roles...");
    }
  
    if (isError) {
      console.error("Error loading roles!");
    }
  
    if (rolesData && rolesData.data) {
      console.log('Roles data:', rolesData); 
      const fetchedRoles = rolesData.data.map((role) => ({
        id: role.id, 
        name: role.name,
      }));
      setRoles(fetchedRoles);
    }
  }, [rolesData, isLoading, isError]);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, false); 
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleSettingsClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseSettings = () => setAnchorEl(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFeedbackMessage("");
  };

  const handleRoleChange = (event) => setSelectedRole(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async () => {
    if (password && selectedRole) {
      try {
        // Call the mutation to switch the role
        const response = await userSwitchRole({ group_id: selectedRole, password });
        if (response.data.status) {
          setFeedbackMessage("Role switched successfully!");
        } else {
          setFeedbackMessage("Failed to switch role.");
        }
      } catch (err) {
        setFeedbackMessage("Error switching role: " + err.message);
      }
      handleClose();
    } else {
      setFeedbackMessage("Please select a role and enter a password.");
    }
  };

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color={light ? "default" : "inherit"}
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>

        {!isMini && (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <Button
                endIcon={<AccountCircleIcon />}
                variant="text"
                size="large"
                sx={navbarIconButton}
                onClick={handleClickOpen}
              >
                {role}
              </Button>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
              <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                sx={{ "& .MuiDialog-paper": { width: "30vw", height: "42vh" } }}
              >
                <DialogTitle sx={{ textAlign: "center" }}>Change Role</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="role-select-label" sx={{ height: "2.5rem" }}>
                      Select Role
                    </InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={selectedRole}
                      onChange={handleRoleChange}
                      label="Select Role"
                      sx={{
                        height: "3rem",
                        ".MuiSelect-select": {
                          padding: "0.75rem",
                        },
                      }}
                    >
                      {isLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : isError ? (
                        <MenuItem disabled>Error loading roles</MenuItem>
                      ) : roles.length > 0 ? (
                        roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No roles available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <MDBox mb={3}>
                    <MDInput
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      value={password}
                      onChange={handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MDBox>
                  {feedbackMessage && (
                    <Alert severity={feedbackMessage.includes("Failed") ? "error" : "success"}>
                      {feedbackMessage}
                    </Alert>
                  )}
                </DialogContent>
                <DialogActions>
                  <MDButton onClick={handleClose} color="error" sx={{ marginRight: "10px" }}>
                    Cancel
                  </MDButton>
                  <MDBox>
                    <MDButton
                      variant="gradient"
                      color="submit"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isSwitchLoading}
                    >
                      {isSwitchLoading ? "Switching..." : "Submit"}
                    </MDButton>
                  </MDBox>
                </DialogActions>
              </Dialog>
              <IconButton
                size="large"
                disableRipple
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                sx={navbarIconButton}
                onClick={handleSettingsClick}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseSettings}>
                <MenuItem component={RouterLink} to="/update-password">
                  Change Password
                </MenuItem>
                <MenuItem component={RouterLink} to="/logout">
                  Logout
                </MenuItem>
              </Menu>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

export default DashboardNavbar;

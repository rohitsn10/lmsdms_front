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

// API hook
import { useSwitchUserRoleMutation } from "api/auth/userRoleApi";
import { requestUserGroupList } from "api/auth/auth";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  const [roles, setRoles] = useState([]); // Store the roles fetched from the API
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // State for settings dropdown
  const [showPassword, setShowPassword] = useState(false);

  const [switchUserRole, { isLoading: isSwitching, isError, error, isSuccess }] =
    useSwitchUserRoleMutation();
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    // Fetch the user group list on component mount
    const fetchRoles = async () => {
      try {
        const response = await requestUserGroupList(); 
        setRoles(response.data || []); 
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    fetchRoles();
  }, []); 

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

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
        const response = await switchUserRole({ group_name: selectedRole, password }).unwrap();
        setFeedbackMessage("Role switched successfully!");
        setTimeout(() => {
          setFeedbackMessage("");
          handleClose();
        }, 2000);
      } catch (err) {
        setFeedbackMessage(err?.data?.message || "Failed to switch role. Please try again.");
      }
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
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
              <IconButton sx={navbarIconButton} size="small" disableRipple onClick={handleClickOpen}>
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                sx={{
                  "& .MuiDialog-paper": {
                    width: "30vw",
                    height: "42vh",
                  },
                }}
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
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
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
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MDBox>
                  {feedbackMessage && (
                    <Alert severity={isError ? "error" : "success"}>{feedbackMessage}</Alert>
                  )}
                </DialogContent>
                <DialogActions>
                <MDButton 
  onClick={handleClose} 
  color="error" 
  sx={{ marginRight: "10px" }}
>
  Cancel
</MDButton>
<MDBox>
  <MDButton 
    variant="gradient" 
    color="submit" 
    fullWidth 
    onClick={handleSubmit}
    disabled={isSwitching}
  >
    {isSwitching ? <CircularProgress size={20} /> : "Submit"}
  </MDButton>
</MDBox>

                </DialogActions>
              </Dialog>
              <IconButton
                size="small"
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
                  Update Password
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

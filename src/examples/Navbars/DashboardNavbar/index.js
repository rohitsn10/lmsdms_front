import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
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
} from "@mui/material";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const roles = ["Author", "Reviewer", "Approver", "vatsal", "Doc Admin"];
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // State for settings dropdown

  useEffect(() => {
    // Setting the navbar type
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

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = () => {
    if (password && selectedRole) {
      // Perform role change action (e.g., API call)
      console.log("Role changed to:", selectedRole, "with password:", password);
      handleClose(); // Close dialog after submission
    } else {
      // Handle validation (show an error if password or role is not selected)
      console.log("Please select a role and enter your password.");
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

  // Function to open the dropdown menu
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the dropdown menu
  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  // Handle menu item click (customize as needed)
  const handleMenuItemClick = (item) => {
    console.log("Clicked:", item);
    handleCloseSettings(); // Close the menu after clicking an item
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleClickOpen}
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>

              <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                sx={{
                  "& .MuiDialog-paper": {
                    width: "30vw", // 50% of the viewport width
                    height: "42vh", // 50% of the viewport height
                  },
                }}
              >
                <DialogTitle sx={{ textAlign: "center" }}>Change Role</DialogTitle>{" "}
                {/* Centered title */}
                <DialogContent>
                  <FormControl fullWidth margin="normal">
                    <InputLabel
                      id="role-select-label"
                      sx={{
                        height: "2.5rem",
                      }}
                    >
                      Select Role
                    </InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={selectedRole}
                      onChange={handleRoleChange}
                      label="Select Role"
                      sx={{
                        height: "3rem", // Adjust the height here
                        ".MuiSelect-select": {
                          padding: "0.75rem", // Adjust padding for the select input text
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <MDBox mb={3}>
                    <MDInput
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose} // Close the dialog when cancel is clicked
                    variant="outlined"
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main", // Match the color of the border
                      "&:hover": { backgroundColor: "primary.dark", color: "#fff" }, // Light background on hover
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                      backgroundColor: "primary.main", // Primary color
                      color: "#fff",
                      "&:hover": { backgroundColor: "primary.dark" }, // Darker shade on hover
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleSettingsClick}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseSettings}
              >
                <MenuItem onClick={() => handleMenuItemClick("Release Document")}>
                  Release Document
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Print Document")}>
                  Print Document
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Review Document")}>
                  Review Document
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Roles and Permissions")}>
                  Roles and Permissions
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Logout")}>
                  Logout
                </MenuItem>
              </Menu>
              <Link to="/document-view" style={{ textDecoration: "none", color: "inherit" }}>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                >
                  <Icon sx={iconsStyle}>notifications</Icon>
                </IconButton>
              </Link>
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

export default DashboardNavbar;

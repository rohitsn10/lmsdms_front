// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LinearProgress from "@mui/material/LinearProgress";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h4" fontWeight="big">
          Progress Timeline
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDBox mt={0} mb={2}>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon={<CheckCircleOutlineIcon />}
          title="Author"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="success"
          icon={<CheckCircleOutlineIcon />}
          title="Reviewer 1"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="warning"
          icon={<HourglassTopIcon />}
          title="Reviewer 2"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon={<HourglassTopIcon />}
          title="Reviewer 3"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="warning"
          icon={<HourglassTopIcon />}
          title="Approver"
          dateTime="18 DEC 4:54 AM"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;

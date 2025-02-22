/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import RateReviewTwoToneIcon from "@mui/icons-material/RateReviewTwoTone";
import DraftsIcon from "@mui/icons-material/Drafts";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import TopicIcon from "@mui/icons-material/Topic";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
// import PieChart from "examples/Charts/PieChart";
function LMSDashboard() {
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <Grid container spacing={3} mt={4}>
          <Grid item xs={20} md={6} lg={4}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "series B" },
                    { id: 1, value: 15, label: "series B" },
                    { id: 2, value: 20, label: "series C" },
                  ],
                },
              ]}
              width={700}
              height={500}
            />
          </Grid>
          <MDBox py={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                {/* <Link to="/review-document"> */}
                <ComplexStatisticsCard
                  icon={<RateReviewTwoToneIcon />}
                  color="warning"
                  title="Under Review"
                  // count={reviewData?.dataCountreview || 0}
                  percentage={{
                    color: "success",
                  }}
                />
                {/* </Link> */}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                {/* <Link to="/draft-document"> */}
                <ComplexStatisticsCard
                  color="dark"
                  icon={<DraftsIcon />}
                  title="Under Draft"
                  // count={savedraftData?.dataCountsavedraft || 0}
                  percentage={{
                    color: "success",
                  }}
                />
                {/* </Link> */}
              </MDBox>
            </Grid>
          </MDBox>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default LMSDashboard;

import React from 'react';
import { Grid } from '@mui/material';
import { useGetDashboardCountsQuery } from 'api/auth/dashboardApi'; // Make sure to import the API hook
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import TopicIcon from '@mui/icons-material/Topic';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { data, error, isLoading } = useGetDashboardCountsQuery(); // Fetch the dashboard counts
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard data</div>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/user-listing">
                <ComplexStatisticsCard
                  color="primary"
                  icon={<PersonAddIcon />}
                  title="User"
                  count={data.user_count} // Dynamic count from API response
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/document-listing">
                <ComplexStatisticsCard
                  icon={<TopicIcon />}
                  color="warning"
                  title="Document"
                  count={data.document_count} // Dynamic count from API response
                  percentage={{
                    color: "success",
                    label: "Updated last month",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/department-listing">
                <ComplexStatisticsCard
                  color="success"
                  icon={<ApartmentIcon />}
                  title="Department"
                  count={data.department_count} // Dynamic count from API response
                  percentage={{
                    color: "success",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/workflow-listing">
                <ComplexStatisticsCard
                  color="dark"
                  icon={<AssignmentTurnedInIcon />}
                  title="WorkFlow"
                  count={data.workflow_count} // Dynamic count from API response
                  percentage={{
                    color: "success",
                    label: "Updated yesterday",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;

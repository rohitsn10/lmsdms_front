import React from "react";
import { Grid } from "@mui/material";
import { useGetDashboardCountsQuery } from "api/auth/dashboardApi"; // Make sure to import the API hook
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TopicIcon from "@mui/icons-material/Topic";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DraftsIcon from "@mui/icons-material/Drafts";
import TaskIcon from "@mui/icons-material/Task";
import CancelPresentationTwoToneIcon from "@mui/icons-material/CancelPresentationTwoTone";
import RateReviewTwoToneIcon from "@mui/icons-material/RateReviewTwoTone";
import { Link } from "react-router-dom";
import { useGetDocumentDataOfStatusIdElevenQuery } from "api/auth/dashboardApi";
import { useGetDocumentDataOfStatusIdNineQuery } from "api/auth/dashboardApi";
import { useGetDocumentDataOfStatusIdThreeQuery } from "api/auth/dashboardApi";
import { useGetDocumentDataOfStatusIdTwoQuery } from "api/auth/dashboardApi";

function Dashboard() {
  const { data, error, isLoading } = useGetDashboardCountsQuery(); // Fetch the dashboard counts
  const { data: rejectedData, isLoading: loadingRejected, error: rejectedError } = useGetDocumentDataOfStatusIdElevenQuery({
    departmentId: "",
    startDate: "",
    endDate: "",
  });
  
  const { data: approveData, isLoading: loadingApprove, error: approveError } = useGetDocumentDataOfStatusIdNineQuery({
    departmentId: "",
    startDate: "",
    endDate: "",
  });
  
  const { data: reviewData, isLoading: loadingReview, error: reviewError } = useGetDocumentDataOfStatusIdThreeQuery({
    departmentId: "",
    startDate: "",
    endDate: "",
  });
  
  const { data: savedraftData, isLoading: loadingSavedraft, error: savedraftError } = useGetDocumentDataOfStatusIdTwoQuery({
    departmentId: "",
    startDate: "",
    endDate: "",
  });
 
  console.log("-+---+-+-+-the response of count ",rejectedData);
  console.log("-+---+-+-+-the response of count ",approveData);
  console.log("-+---+-+-+-the response of count ",reviewData);
  console.log("-+---+-+-+-the response of count ",savedraftData);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard data</div>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<PersonAddIcon />}
                title="User"
                count={data?.user_count || 0}  // Assuming user_count comes from your main `data`
                percentage={{
                  color: "success",
                  label: "Updated yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<TopicIcon />}
                color="warning"
                title="Document"
                count={data?.document_count || 0}  // Assuming document_count comes from your main `data`
                percentage={{
                  color: "success",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<ApartmentIcon />}
                title="Department"
                count={data?.department_count || 0}  // Assuming department_count comes from your main `data`
                percentage={{
                  color: "success",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<AssignmentTurnedInIcon />}
                title="WorkFlow"
                count={data?.workflow_count || 0}  // Assuming workflow_count comes from your main `data`
                percentage={{
                  color: "success",
                  label: "Updated yesterday",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
  
      <MDBox py={3}>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/review-document">
                <ComplexStatisticsCard
                  icon={<RateReviewTwoToneIcon />}
                  color="warning"
                  title="Under Review"
                  count={reviewData?.dataCountreview || 0}  
                  percentage={{
                    color: "success",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/draft-document">
                <ComplexStatisticsCard
                  color="dark"
                  icon={<DraftsIcon />}
                  title="Under Draft"
                  count={savedraftData?.dataCountsavedraft || 0}  
                  percentage={{
                    color: "success",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/reject-document">
                <ComplexStatisticsCard
                  color="error"
                  icon={<CancelPresentationTwoToneIcon />}
                  title="Rejected"
                  count={rejectedData?.dataCountreject || 0}  
                  percentage={{
                    color: "success",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/approve-document">
                <ComplexStatisticsCard
                  color="success"
                  icon={<TaskIcon />}
                  title="Approved"
                  count={approveData?.dataCountapprove  || 0}  
                  percentage={{
                    color: "success",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
  
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LinearProgress from "@mui/material/LinearProgress";
import { useDocTimeLineQuery } from "api/auth/timeLineApi";  // Assuming this hook is defined
import PropTypes from 'prop-types';  // Ensure PropTypes is imported

const OrdersOverview = ({ docId }) => {
  const { data, isLoading, error } = useDocTimeLineQuery(docId); // Fetching timeline data
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    if (data) {
      const timelineItems = [];
      
      // Check each action in the response and push relevant data to timelineItems
      const addItem = (actions, title, icon, color) => {
        if (actions.length > 0) {
          actions.forEach(action => {
            timelineItems.push({
              title,
              dateTime: action.date || "Unknown",
              icon,
              color,
            });
          });
        }
      };

      // Add different actions to the timeline dynamically
      addItem(data.author_approvals, "Author Approval", <CheckCircleOutlineIcon />, "success");
      addItem(data.reviewer_actions, "Reviewer Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.approver_actions, "Approver Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.doc_admin_actions, "Document Admin Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.release_actions, "Release Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.effective_actions, "Effective Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.revision_actions, "Revision Actions", <CheckCircleOutlineIcon />, "success");
      addItem(data.revision_requests, "Revision Requests", <CheckCircleOutlineIcon />, "success");

      // Add items based on 'send_back_actions'
      data.send_back_actions.forEach(() => {
        timelineItems.push({
          title: "Send Back Actions",
          dateTime: "Unknown",
          icon: <HourglassTopIcon />,
          color: "error", // For 'send_back_actions', set color as error
        });
      });

      setTimelineData(timelineItems);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h4" fontWeight="big">
            Loading Timeline...
          </MDTypography>
          <LinearProgress sx={{ marginTop: 2 }} />
        </MDBox>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h4" fontWeight="big">
            Error loading timeline.
          </MDTypography>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h4" fontWeight="big">
          Document Timeline
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {timelineData.length > 0 ? (
          timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              color={item.color}
              icon={item.icon}
              title={item.title}
              dateTime={item.dateTime}
              lastItem={index === timelineData.length - 1}
            />
          ))
        ) : (
          <MDTypography variant="h6" color="textSecondary">
            No actions to show for this document.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
};
OrdersOverview.propTypes = {
  docId: PropTypes.string.isRequired,  // Ensure docId is a required string
};

export default OrdersOverview;

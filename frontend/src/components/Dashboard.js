import React from "react";
import HealthData from "./HealthData";
import TargetVsProcessGraph from "./TargetVsProcessGraph";

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Principal Investigator Dashboard</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <HealthData />
        </div>
        <div className="col-md-6 mb-4">
          <TargetVsProcessGraph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
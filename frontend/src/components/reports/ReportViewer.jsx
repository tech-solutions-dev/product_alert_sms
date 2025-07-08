import React from 'react';

const ReportViewer = ({ url }) => {
  if (!url) return <div className="text-gray-500">No report selected.</div>;
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded shadow overflow-hidden">
      <iframe
        src={url}
        title="Report Viewer"
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default ReportViewer;

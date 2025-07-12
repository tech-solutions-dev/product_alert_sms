import React from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

const ReportList = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_ENDPOINTS.REPORTS);
        setData(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner text="Loading reports..." />;
  if (error) return <div className="text-red-600">Failed to load reports.</div>;

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Generated Reports</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Type</th>
            <th className="py-2 text-left">Created At</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.reports?.length === 0 && (
            <tr><td colSpan={3} className="text-center py-4">No reports found.</td></tr>
          )}
          {data?.reports?.map((report) => (
            <tr key={report.id} className="border-b">
              <td className="py-2">{report.type}</td>
              <td className="py-2">{new Date(report.createdAt).toLocaleString()}</td>
              <td className="py-2 flex gap-2">
                <a
                  href={report.downloadUrl}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  download
                >
                  Download
                </a>
                <a
                  href={report.viewUrl}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReportList;

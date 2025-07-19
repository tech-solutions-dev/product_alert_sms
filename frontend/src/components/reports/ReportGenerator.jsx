import React, { useState } from 'react';
import { API_ENDPOINTS, REPORT_TYPES } from '../../utils/constants';
import api from "../../services/api";

const ReportGenerator = () => {
  const [type, setType] = useState(REPORT_TYPES.EXPIRY);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      await api.post(API_ENDPOINTS.GENERATE_REPORT, { type, from, to });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-end mb-4 flex-wrap"
    >
      <div>
        <label className="block mb-1 font-medium">Report Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="border rounded px-3 py-2"
        >
          {Object.entries(REPORT_TYPES).map(([key, val]) => (
            <option key={val} value={val}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">From</label>
        <input
          type="date"
          required
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">To</label>
        <input
          type="date"
          required
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report"}
      </button>
      {isSuccess && <span className="text-green-600">Report generated!</span>}
      {isError && (
        <span className="text-red-600">Failed to generate report.</span>
      )}
    </form>
  );
};

export default ReportGenerator;

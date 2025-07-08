import React, { useState } from 'react';

// Placeholder: In production, integrate a real barcode scanner library (e.g. quaggaJS, zxing, etc.)
const BarcodeScanner = ({ onScan }) => {
  const [barcode, setBarcode] = useState('');

  const handleScan = (e) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode('');
    }
  };

  return (
    <form onSubmit={handleScan} className="flex gap-2 items-end mb-4">
      <div>
        <label className="block mb-1 font-medium">Scan Barcode</label>
        <input
          type="text"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Enter or scan barcode"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Scan</button>
    </form>
  );
};

export default BarcodeScanner;

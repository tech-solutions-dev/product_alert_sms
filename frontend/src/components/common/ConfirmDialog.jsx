import React from 'react';

const ConfirmDialog = ({ open, title = 'Are you sure?', message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {message && <p className="mb-4">{message}</p>}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >Cancel</button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >Confirm</button> 
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

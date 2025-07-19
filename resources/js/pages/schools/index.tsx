import React from 'react';

const SchoolsIndex = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create School</button>
      </div>
      <div className="bg-white shadow rounded p-4">
        {/* School list will go here */}
        <p className="text-gray-500">No schools found. (List will be implemented)</p>
      </div>
    </div>
  );
};

export default SchoolsIndex;

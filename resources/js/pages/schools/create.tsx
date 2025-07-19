import React from 'react';

const CreateSchool = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create School</h1>
      <form className="bg-white shadow rounded p-6 max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">School Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" placeholder="School Name" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Address</label>
          <input type="text" className="w-full border rounded px-3 py-2" placeholder="Address" />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
      </form>
    </div>
  );
};

export default CreateSchool;

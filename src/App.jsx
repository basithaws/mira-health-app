import React, { useState, useEffect } from 'react';

// Swap localhost string out during deployment scenarios for dynamic URL routing
// const API_BASE_URL = 'http://localhost:8080/api/patients';

const API_BASE_URL = 'https://backend-health-app-ap47.onrender.com/api/patients';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '', dob: '', email: '', glucose: '', haemoglobin: '', cholesterol: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setErrorMessage('Network transmission execution fault during loading parameters.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          glucose: parseFloat(formData.glucose),
          haemoglobin: parseFloat(formData.haemoglobin),
          cholesterol: parseFloat(formData.cholesterol)
        })
      });

      const jsonResponse = await res.json();
      if (!res.ok) {
        throw new Error(jsonResponse.detail?.[0]?.msg || jsonResponse.detail || 'Validation error');
      }

      setFormData({ full_name: '', dob: '', email: '', glucose: '', haemoglobin: '', cholesterol: '' });
      setEditingId(null);
      fetchPatients();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleEditInit = (patient) => {
    setEditingId(patient.id);
    setFormData({
      full_name: patient.full_name,
      dob: patient.dob,
      email: patient.email,
      glucose: patient.glucose.toString(),
      haemoglobin: patient.haemoglobin.toString(),
      cholesterol: patient.cholesterol.toString()
    });
  };

  const handleDeleteExec = async (id) => {
    if (!window.confirm('Purge structural configuration entry permanently?')) return;
    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      fetchPatients();
    } catch (err) {
      setErrorMessage('Purge operation structural failure.');
    }
  };

  return (
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-slate-900 text-white p-4 shadow-md">
        <h1 class="text-xl font-bold tracking-wide">🔬 MIRA Intelligence Panel Dashboard</h1>
      </nav>

      <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Data Form */}
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 text-slate-700">{editingId ? 'Modify Metrics Record' : 'Create Clinical Metrics Index'}</h2>
          {errorMessage && <div class="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{errorMessage}</div>}
          
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Glucose</label>
                <input type="number" step="0.1" name="glucose" value={formData.glucose} onChange={handleInputChange} required class="w-full border p-2 rounded" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Haemoglobin</label>
                <input type="number" step="0.1" name="haemoglobin" value={formData.haemoglobin} onChange={handleInputChange} required class="w-full border p-2 rounded" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Cholesterol</label>
                <input type="number" step="0.1" name="cholesterol" value={formData.cholesterol} onChange={handleInputChange} required class="w-full border p-2 rounded" />
              </div>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded shadow transition-colors">
              {editingId ? 'Update Operational Entry' : 'Publish Metrics Entry'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ full_name: '', dob: '', email: '', glucose: '', haemoglobin: '', cholesterol: '' }); }} class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 rounded mt-1">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Data Matrix Workspace View */}
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4 text-slate-700">Dynamic Live Logs Matrix</h2>
          {patients.length === 0 ? (
            <p class="text-gray-400 italic text-center py-12">No evaluation files cataloged inside local server allocation frameworks.</p>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th class="p-3">Identity Record</th>
                    <th class="p-3">Lab Metrics</th>
                    <th class="p-3">AI Diagnostic Summary Remarks</th>
                    <th class="p-3 text-center">Controls</th>
                  </tr>
                </thead>
                <tbody class="divide-y text-sm">
                  {patients.map((p) => (
                    <tr key={p.id} class="hover:bg-slate-50">
                      <td class="p-3 font-medium text-gray-900">
                        <div>{p.full_name}</div>
                        <div class="text-xs text-gray-400 font-normal">{p.email} | {p.dob}</div>
                      </td>
                      <td class="p-3 whitespace-nowrap">
                        <div class="text-xs space-y-0.5">
                          <div><span class="font-semibold text-gray-500">GLU:</span> {p.glucose} mg/dL</div>
                          <div><span class="font-semibold text-gray-500">HEM:</span> {p.haemoglobin} g/dL</div>
                          <div><span class="font-semibold text-gray-500">CHO:</span> {p.cholesterol} mg/dL</div>
                        </div>
                      </td>
                      <td class="p-3 text-xs text-slate-600 max-w-xs">{p.remarks}</td>
                      <td class="p-3 text-center space-x-2 whitespace-nowrap">
                        <button onClick={() => handleEditInit(p)} class="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                        <button onClick={() => handleDeleteExec(p.id)} class="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
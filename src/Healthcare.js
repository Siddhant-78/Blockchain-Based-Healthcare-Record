import React, { useState, useEffect } from 'react';
import HealthcareABI from './HealthcareABI.json';
import { ethers } from 'ethers';

const Healthcare = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [fetchPatientName, setFetchPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [patientRecords, setPatientRecords] = useState([]);
  const [providerAddress, setProviderAddress] = useState('');
  const [deletePatientName, setDeletePatientName] = useState('');
  const [deleteRecordIndex, setDeleteRecordIndex] = useState('');
  const [allRecords, setAllRecords] = useState([]);
  const [recordIndex, setRecordIndex] = useState('');


  const contractAddress = "Add your contract address";

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        const contract = new ethers.Contract(contractAddress, HealthcareABI, signer);
        setContract(contract);

        const ownerAddress = await contract.getOwner();
        setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());

        const balance = await provider.getBalance(accountAddress);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error connecting to wallet: ", error);
      }
    };
    connectWallet();
  }, []);

  const fetchPatientRecords = async () => {
    try {
      const records = await contract.getPatientRecord(fetchPatientName);
      setPatientRecords(records);
    } catch (error) {
      console.error("Error fetching patient records", error);
    }
  };

  const checkBalance = async () => {
    try {
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance: ", error);
    }
  };

  const clearPatientRecords = () => {
    setPatientRecords([]);
    setFetchPatientName('');
  };

  const clearAllRecords = () => {
    setAllRecords([]);
  };


  const addRecord = async () => {
    try {
      const tx = await contract.addRecord(patientName, age, gender, bloodType, allergies, diagnosis, treatment);
      await tx.wait();

      fetchPatientRecords();
      alert("Record added successfully");

      // Clear input fields after adding record
      setPatientName('');
      setAge('');
      setGender('');
      setBloodType('');
      setAllergies('');
      setDiagnosis('');
      setTreatment('');

    } catch (error) {
      console.error("Error adding records", error);
    }
  };

  const authorizeProvider = async () => {
    if (isOwner) {
      try {
        const tx = await contract.authorizeProvider(providerAddress);
        await tx.wait();
        alert(`Provider ${providerAddress} authorized successfully`);
      } catch (error) {
        console.error("Error authorizing provider", error);
      }
    } else {
      alert("Only contract owner can call this function");
    }
  };

  const revokeProvider = async () => {
    if (isOwner) {
      try {
        const tx = await contract.revokeProvider(providerAddress);
        await tx.wait();
        alert(`Provider ${providerAddress} revoked successfully`);
      } catch (error) {
        console.error("Error revoking provider", error);
      }
    } else {
      alert("Only contract owner can call this function");
    }
  };

  const deleteRecord = async () => {
    try {
      const tx = await contract.deleteRecord(deleteRecordIndex, deletePatientName);
      await tx.wait();
      fetchPatientRecords();
      alert("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record", error);
    }
  };

  const fetchAllRecords = async () => {
    try {
      const records = await contract.getAllRecords();
      setAllRecords(records);
    } catch (error) {
      console.error("Error fetching all records", error);
    }
  };

  const updateRecord = async () => {
    try {
      const tx = await contract.updateRecord(
        Number(recordIndex), // Convert to number
        patientName,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment
      );
      await tx.wait();
      fetchPatientRecords();
      alert("Record updated successfully");
    } catch (error) {
      console.error("Error updating record", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">Healthcare Application</h1>
          <div className="bg-gray-800 rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col">
              {isOwner && <p className="text-green-400 font-semibold">Admin</p>}
              {account && <p className="text-gray-300"><span className="font-semibold">Connected Account:</span> {account}</p>}
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              <p className="mr-4"><span className="font-semibold">Balance:</span> {balance} ETH</p>
              <button onClick={checkBalance} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                Check Balance
              </button>
            </div>
          </div>
        </div>

        {/* Provider Management Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Manage Healthcare Providers</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Provider Address" value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button onClick={authorizeProvider} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Authorize Provider
            </button>
            <button onClick={revokeProvider} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Revoke Provider
            </button>
          </div>
        </div>

        {/* Add Patient Record Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Add Patient Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input type="text" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button onClick={addRecord} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Add Record
          </button>
        </div>

        {/* Update Patient Record Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Update Patient Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="number" placeholder="Record Index" value={recordIndex} onChange={(e) => setRecordIndex(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input type="text" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button onClick={updateRecord} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Update Record
          </button>
        </div>

        {/* Delete Patient Record Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Delete Patient Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="number" placeholder="Record Index" value={deleteRecordIndex} onChange={(e) => setDeleteRecordIndex(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <input type="text" placeholder="Patient Name" value={deletePatientName} onChange={(e) => setDeletePatientName(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button onClick={deleteRecord} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Delete Record
          </button>
        </div>

        {/* Fetch Patient Records Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Fetch Patient Records</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Enter Patient Name" value={fetchPatientName} onChange={(e) => setFetchPatientName(e.target.value)} className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button onClick={fetchPatientRecords} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Fetch Records
            </button>
            <button onClick={clearPatientRecords} className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Clear
            </button>
          </div>
        </div>

        {/* Patient Records Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Patient Records</h2>
          {patientRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Record ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Blood Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Allergies</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diagnosis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Treatment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {patientRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.recordID.toNumber()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.age.toNumber()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.bloodType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.allergies}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.diagnosis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.treatment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 italic">No records found.</p>
          )}
        </div>

        {/* All Records Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">All Records</h2>
          <div className="flex gap-3 mb-4">
            <button onClick={fetchAllRecords} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Fetch All Records
            </button>
            <button onClick={clearAllRecords} className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Clear
            </button>
          </div>

          {allRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Record ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Blood Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Allergies</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diagnosis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Treatment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {allRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.recordID.toNumber()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.age.toNumber()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.bloodType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.allergies}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.diagnosis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{record.treatment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 italic">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Healthcare;

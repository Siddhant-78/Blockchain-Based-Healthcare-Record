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


    const contractAddress = "0x338B91531D30659af3B7ed4F555d6e46015B159F";

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
        <div className='container'>
            <h1 className='title'>Healthcare Application</h1>
            {account && <p className='account-info'>Connected Account: {account}</p>}
            {isOwner && <p className='owner-info'>You are the contract owner</p>}
            <p className='balance-info'>Balance: {balance} ETH</p>
            <button className='action-button' onClick={checkBalance}>Check Balance</button>

            <div className='form-section'>
                <h2>Manage Healthcare Providers</h2>
                <input className='input-field' type='text' placeholder='Provider Address' value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} />
                <button className='action-button' onClick={authorizeProvider}>Authorize Provider</button>
                <button className='action-button revoke clear' onClick={revokeProvider}>Revoke Provider</button>
            </div>

            <div className='form-section'>
                <h2>Add Patient Record</h2>
                <input className='input-field' type='text' placeholder='Patient Name' value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input className='input-field' type='number' placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
                <input className='input-field' type='text' placeholder='Gender' value={gender} onChange={(e) => setGender(e.target.value)} />
                <input className='input-field' type='text' placeholder='Blood Type' value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
                <input className='input-field' type='text' placeholder='Allergies' value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                <input className='input-field' type='text' placeholder='Diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <input className='input-field' type='text' placeholder='Treatment' value={treatment} onChange={(e) => setTreatment(e.target.value)} />
                <button className='action-button' onClick={addRecord}>Add Record</button>
            </div>

            <div className='form-section'>
                <h2>Update Patient Record</h2>
                <input className='input-field' type='number' placeholder='Record Index' value={recordIndex} onChange={(e) => setRecordIndex(e.target.value)} />
                <input className='input-field' type='text' placeholder='Patient Name' value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input className='input-field' type='number' placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
                <input className='input-field' type='text' placeholder='Gender' value={gender} onChange={(e) => setGender(e.target.value)} />
                <input className='input-field' type='text' placeholder='Blood Type' value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
                <input className='input-field' type='text' placeholder='Allergies' value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                <input className='input-field' type='text' placeholder='Diagnosis' value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <input className='input-field' type='text' placeholder='Treatment' value={treatment} onChange={(e) => setTreatment(e.target.value)} />
                <button className='action-button' onClick={updateRecord}>Update Record</button>
            </div>

            <div className='form-section'>
                <h2>Delete Patient Record</h2>
                <input className='input-field' type='text' placeholder='Patient Name' value={deletePatientName} onChange={(e) => setDeletePatientName(e.target.value)} />
                <input className='input-field' type='number' placeholder='Record Index' value={deleteRecordIndex} onChange={(e) => setDeleteRecordIndex(e.target.value)} />
                <button className='action-button' onClick={deleteRecord}>Delete Record</button>
            </div>

            <div>
            
            

            
        </div>

            <div className='form-section'>
                <h2>Fetch Patient Records</h2>
                <input className='input-field' type='text' placeholder='Enter Patient Name' value={fetchPatientName} onChange={(e) => setFetchPatientName(e.target.value)} />
                <button className='action-button' onClick={fetchPatientRecords}>Fetch Records</button>
                <button className='action-button clear' onClick={clearPatientRecords}>Clear</button>

            </div>

            <div className='records-section'>
            <h2>Patient Records</h2>
            {patientRecords.length > 0 ? (
                <table className='records-table'>
                    <thead>
                        <tr>
                            <th>Record ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Blood Type</th>
                            <th>Allergies</th>
                            <th>Diagnosis</th>
                            <th>Treatment</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.recordID.toNumber()}</td>
                                <td>{record.patientName}</td>
                                <td>{record.age.toNumber()}</td>
                                <td>{record.gender}</td>
                                <td>{record.bloodType}</td>
                                <td>{record.allergies}</td>
                                <td>{record.diagnosis}</td>
                                <td>{record.treatment}</td>
                                <td>{new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No records found.</p>}
            </div>

            <div className='records-section'>
                <h2>All Records</h2>
                <div>
                <button className='action-button' onClick={fetchAllRecords}>Fetch All Records</button>
               
                    <button className='action-button clear' onClick={clearAllRecords}>Clear</button>
                </div>

                {allRecords.length > 0 ? (
                <table className='records-table'>
                    <thead>
                        <tr>
                            <th>Record ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Blood Type</th>
                            <th>Allergies</th>
                            <th>Diagnosis</th>
                            <th>Treatment</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.recordID.toNumber()}</td>
                                <td>{record.patientName}</td>
                                <td>{record.age.toNumber()}</td>
                                <td>{record.gender}</td>
                                <td>{record.bloodType}</td>
                                <td>{record.allergies}</td>
                                <td>{record.diagnosis}</td>
                                <td>{record.treatment}</td>
                                <td>{new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No records found.</p>}
            </div>
        </div>
    );
};

export default Healthcare;

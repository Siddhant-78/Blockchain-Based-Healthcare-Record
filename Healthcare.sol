// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HealthcareRecords {
    address owner;

    struct Record {
        uint256 recordID;
        string patientName;
        uint256 age;
        string gender;
        string bloodType;
        string allergies;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    Record[] private patientRecords;
    mapping(address => bool) private authorizedProviders;

    event RecordAdded(uint256 recordID, string patientName, uint256 timestamp);
    event RecordUpdated(uint256 recordIndex, string patientName, uint256 timestamp);
    event RecordDeleted(uint256 recordIndex, string patientName, uint256 timestamp);
    event ProviderAuthorized(address provider);
    event ProviderRevoked(address provider);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this function");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not an authorized provider");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function authorizeProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }

    function revokeProvider(address provider) public onlyOwner {
        require(authorizedProviders[provider], "Provider is not authorized");
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function addRecord(
        string memory patientName,
        uint256 age,
        string memory gender,
        string memory bloodType,
        string memory allergies,
        string memory diagnosis,
        string memory treatment
    ) public onlyAuthorizedProvider {
        require(bytes(patientName).length > 0, "Patient name cannot be empty");
        require(age > 0, "Age must be greater than zero");

        uint256 recordID = patientRecords.length + 1;
        patientRecords.push(Record(recordID, patientName, age, gender, bloodType, allergies, diagnosis, treatment, block.timestamp));

        emit RecordAdded(recordID, patientName, block.timestamp);
    }

    function updateRecord(
        uint256 recordIndex,
        string memory patientName,
        uint256 age,
        string memory gender,
        string memory bloodType,
        string memory allergies,
        string memory diagnosis,
        string memory treatment
    ) public onlyAuthorizedProvider {
        require(recordIndex > 0 && recordIndex <= patientRecords.length, "Invalid record index");
        require(compareStrings(patientRecords[recordIndex - 1].patientName, patientName), "Patient name does not match");

        Record storage record = patientRecords[recordIndex - 1];
        record.age = age;
        record.gender = gender;
        record.bloodType = bloodType;
        record.allergies = allergies;
        record.diagnosis = diagnosis;
        record.treatment = treatment;
        record.timestamp = block.timestamp;

        emit RecordUpdated(recordIndex, patientName, block.timestamp);
    }

    function getPatientRecord(string memory patientName) public view onlyAuthorizedProvider returns (Record[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < patientRecords.length; i++) {
            if (compareStrings(patientRecords[i].patientName, patientName)) {
                count++;
            }
        }

        Record[] memory result = new Record[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < patientRecords.length; i++) {
            if (compareStrings(patientRecords[i].patientName, patientName)) {
                result[index] = patientRecords[i];
                index++;
            }
        }
        return result;
    }

    function getAllRecords() public view onlyAuthorizedProvider returns (Record[] memory) {
        return patientRecords;
    }

    function deleteRecord(uint256 recordIndex, string memory patientName) public onlyAuthorizedProvider {
        require(recordIndex > 0 && recordIndex <= patientRecords.length, "Invalid record index");
        require(compareStrings(patientRecords[recordIndex - 1].patientName, patientName), "Patient name does not match");

        patientRecords[recordIndex - 1] = patientRecords[patientRecords.length - 1];
        patientRecords.pop();

        emit RecordDeleted(recordIndex, patientName, block.timestamp);
    }
}


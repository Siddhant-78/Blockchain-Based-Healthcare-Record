# Blockchain-Based Healthcare Record 📋🔐

A decentralized, secure, and patient-centric system for managing healthcare records using blockchain technology.

---

## 🔍 Features

* **Immutable Record Storage**
  Healthcare records are stored on-chain using smart contracts to ensure data integrity and tamper-proof audit trails.

* **Role-Based Access Control**
  Doctors and patients have separate private keys; smart contracts verify access permissions before allowing record retrieval or updates.

* **Patient-Doctor Authorization Flow**
  Patients authorize doctors to access records via blockchain transactions; doctors can only view/update once granted permission.


---

## ⚙️ Tech Stack

* **Blockchain & Smart Contracts**: Solidity on Ethereum  testnet sepolia
* **Backend**: Node.js + Express 
* **Frontend**: React.js with  Ethers.js integration
* **Wallet Integration**: MetaMask (for user key management & signing)

---

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Siddhant-78/Blockchain-Based-Healthcare-Record.git
   cd Blockchain-Based-Healthcare-Record
   ```

2. **Install dependencies**

   ```bash
   cd Blockchain-Based-Healthcare-Record
   npm install
   ```

3. **Deploy Smart Contracts**

   This project is deployed the contract on the sepolia testnet


4. **Launch webapp**

   ```bash
   cd Blockchain-Based-Healthcare-Record
   npm start
   
   ```

6. **Use the App**

   * Connect MetaMask to sepolia (or chosen testnet)
   * Register as a person
   * Patients can upload records, authorize person
   * Authorized person can retrieve/view records

---

## 🧹 System Architecture

```
[Frontend (React/Web3.js)] ↔ [MetaMask / Wallet]
       ↓                                     ↓
[Backend API (Node.js/Express)] ↔ [Smart Contracts (Ethereum)]
```

* Frontend → MetaMask connects to smart contracts for on-chain interactions.
* Backend reads data from contracts or fetches off-chain assets (e.g. imaging) via IPFS.

---

## 🙏 Contributions

Contributions, feature requests or bug reports are welcome!
Please raise an issue or submit a pull request with a clear description.

---

## 📜 License

This project is MIT‑licensed. See the [LICENSE](LICENSE) file for details.


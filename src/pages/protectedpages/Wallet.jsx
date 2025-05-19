import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { WalletCards, WalletModal } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet,   } from "@fortawesome/free-solid-svg-icons";

const Wallet = () => {
  const [isModalVisible, setModalVisible] = useState(false); 
  const handleCloseModal = () => setModalVisible(false);

  
 
  return (
    <DashboardLayout>
     <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setModalVisible(true)}
         className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
        >
         <FontAwesomeIcon icon={faWallet}/>
         <span>Add Money</span>
        </button>
        </div>
        
        <WalletModal isVisible={isModalVisible} onClose={handleCloseModal} />
        <WalletCards/>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;

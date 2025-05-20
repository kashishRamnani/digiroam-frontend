import React, { useEffect} from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { WalletCards } from '../../components';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { transactions as fetchTransactions } from '../../features'; // rename to avoid conflict

const Wallet = () => {
 
  const handleCloseModal = () => setModalVisible(false);

  const dispatch = useDispatch();

  const { transactions, loading, error } = useSelector((state) => state.wallet);


  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <DashboardLayout>
      {/* <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setModalVisible(true)}
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            <FontAwesomeIcon icon={faWallet} />
            <span>Wallet TopUp</span>
          </button>
        </div>
        
        <WalletModal isVisible={isModalVisible} onClose={handleCloseModal} /> */}
        <WalletCards />

       <div className="table-container px-4">
            <table className="min-w-full bg-white table-auto max-w-full">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Amount</th>
                <th className=" px-4 py-2">Currency</th>
                  <th className="px-4 py-3">Sourcr</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
               <tbody>
                {transactions && transactions.length > 0 ? (
                  [...transactions].reverse().map((txn) => (
                    <tr key={txn.transactionId || txn.id} className="text-gray-700 cursor-pointer hover:bg-gray-100">
                      <td className=" px-4 py-2">{txn.transactionId|| txn.id}</td>
                      <td className=" px-4 py-2">{txn.amount}</td>
                      <td className="px-4 py-2">{txn.currency}</td>
                       <td className='py-2 px-2'>{txn.source}</td>
                      <td className=" px-4 py-2">{new Date(txn.madeAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        
    </DashboardLayout>
  );
};

export default Wallet;

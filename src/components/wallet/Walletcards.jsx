import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faCoins,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { WalletModal } from "../../components";

const WalletCards = () => {
  const { balance = 0, transactions = [] } = useSelector((state) => state.wallet || {});
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const totalDeposit = transactions
    .filter((txn) => txn.type === "DEPOSIT")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalWithdraw = transactions
    .filter((txn) => txn.type === "WITHDRAW")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const cards = [
    {
      icon: faCoins,
      title: "Balance",
      value: `$${balance}`,
      showButton: true,
    },
    {
      icon: faHandHoldingUsd,
      title: "Total Deposit",
      value: `$${totalDeposit}`,
      showButton: false,
    },
    {
      icon: faFileInvoiceDollar,
      title: "Total Withdraw",
      value: `$${totalWithdraw}`,
      showButton: false,
    },
  ];

  return (
    <div className=" max--w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
       {cards.map((card, index) => {
  const isBalanceCard = card.title === "Balance";

  return (
    <div
      key={index}
      className={`${isBalanceCard 
        ? "md:col-span-2 xl:col-span-1 max-w-7xl scale-105 border-2 p-6"
        : "max-w-xs p-4"} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-row justify-between items-center`}
    >
      <div className="flex items-center space-x-4">
        <div className:p-3 rounded-xl 
       
        
        >
           <div className="p-3 mr-4 rounded-full"
                            style={{
                              backgroundColor: "var(--primary-color)",
                              color: "white",
                            }}>
                             <FontAwesomeIcon icon={card.icon} className={`${card.iconColor} ${isBalanceCard ? "w-5 h-5" : "w-4 h-4"}`} />
                          </div>
          
         
        </div>
        <div>
          <p className={`${isBalanceCard ? "text-3xl font-bold text-blue-500" : "text-base font-semibold text-blue-600"}`}>
            {card.value}
          </p>
          <p className="text-sm text-gray-600">{card.title}</p>
        </div>
      </div>

      {card.showButton && (
        <button
          onClick={() => setModalVisible(true)}
          className="border border-blue-500 text-blue-500 hover:bg-blue-50 transition px-4 py-1 rounded-lg text-sm font-medium"
        >
          <FontAwesomeIcon icon={faWallet} className="mr-2" />
          <span>Top Up</span>
        </button>
      )}
    </div>
  );
})}

      </div>
      <WalletModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default WalletCards;

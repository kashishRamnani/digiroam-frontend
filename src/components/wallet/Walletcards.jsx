import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faHandHoldingUsd,
  faFileInvoiceDollar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import formatBalance from "../../utils/helpers/formateBalance";
import { toggleModal } from "../../features";


const WalletCards = () => {
  const dispatch = useDispatch();
  const { balance,transactions } = useSelector((state) => state.wallet);


  const totalDeposit = transactions
    .filter((txn) => txn.type === "DEPOSIT")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalPurchase = transactions
    .filter((txn) => txn.type === "PURCHASE")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalRefunds = transactions
    .filter((txn) => txn.type === "REFUND")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const cards = [
    {
      icon: faHandHoldingUsd,
      title: "Total Refunds",
      value: `$${formatBalance(totalRefunds)}`,
      showButton: false,
    },
    {
      icon: faCoins,
      title: "Current Balance",
      value: `$${formatBalance(balance)}`,
      showButton: true,
    },
    {
      icon: faFileInvoiceDollar,
      title: "Total Purchases",
      value: `$${formatBalance(totalPurchase)}`,
      showButton: false,
      

    },
    
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-start">
        
        {cards.map((card, index) => {
          const isBalanceCard = card.title === "Current Balance";

          return (
            <div
              key={index}
              className={`bg-white text-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-auto self-start ${isBalanceCard ? "sm:col-span-2 xl:col-span-1" : ""
                }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                  }}
                >
                  <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {card.title}
                  </p>
                  <p
                    className={`${isBalanceCard
                      ? "text-3xl font-bold text-blue-500"
                      : "text-xl font-semibold text-gray-800"
                      }`}
                  >
                    {card.value}
                    
                  </p>
                    
                </div>
                
              </div>
              

              {card.showButton && (
                <div className="flex justify-end">
                  <button
                    onClick={() => dispatch(toggleModal(true))}
                    className="border border-blue-500 text-blue-500 hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                    Top Up
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletCards;

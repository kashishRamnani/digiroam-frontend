
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank, 
  faHandHoldingUsd, 
  faFileInvoiceDollar 
} from "@fortawesome/free-solid-svg-icons";

const WalletCards = () => {
  const currentBalance = 200;
  const totalDeposit = 500;
  const totalWithdraw = 300;

  const cards = [
    {icon: faPiggyBank,title: "Current Balance",value: `$${currentBalance.toFixed(2)}`},
    {
      icon: faHandHoldingUsd,
      title: "Total Deposit",
      value: `$${totalDeposit.toFixed(2)}`,
     
    },
    {
      icon: faFileInvoiceDollar,
      title: "Total Withdraw",
      value: `$${totalWithdraw.toFixed(2)}`
      ,
    },
  ];

  return (
    
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow"
            >
             <div className="p-3 mr-4 rounded-full"
              style={{
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                  }}>
               
                <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-lg font-semibold text-gray-700">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
   
  );
};

export default WalletCards;

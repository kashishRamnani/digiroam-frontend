import { useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Loader, WalletCards } from '../../components';
import { useDispatch, useSelector } from "react-redux";
import { transactions as fetchTransactions } from '../../features';
import getCurrencySymbol from '../../utils/helpers/getCurrencySymbol';
import formatBalance from '../../utils/helpers/formateBalance';
import formateDateTime from '../../utils/helpers/formte.date.time';

const Wallet = () => {
  const dispatch = useDispatch();
  const { transactions, balance, loading } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch, balance]);

  return (
    <DashboardLayout>
      <WalletCards />

      {loading && <Loader />}
      <div className="table-container px-4">
        <table className="min-w-full bg-white table-auto max-w-full">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3 whitespace-nowrap">Transaction ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              [...transactions].reverse().map((txn) => (
                <tr key={txn._id} className="text-gray-700 cursor-pointer hover:bg-gray-100">
                  <td className=" px-4 py-3">{txn.transactionId || txn.id}</td>
                  <td className=" px-4 py-3">{getCurrencySymbol(txn.currency)}{formatBalance(txn.amount)}</td>
                  <td className='py-4 px-3'>{txn.type}</td>
                  <td className='py-4 px-3'>{txn.source}</td>
                  <td className=" px-4 py-3 whitespace-nowrap">{formateDateTime(txn.madeAt)}</td>
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

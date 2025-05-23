import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelAndRefund } from "../../features";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const Action = ({ selectedEsim, onComplete }) => {
  const dispatch = useDispatch();
  const { esimDetails, error } = useSelector((state) => state.dataPlan);
  const { loading: isLoading } = useSelector((state) => state.wallet);

  const isRefundable = esimDetails.smdpStatus === "RELEASED" && esimDetails.esimStatus === "GOT_RESOURCE";

  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
    }
  }, [dispatch, selectedEsim]);

  const handleCancelAndRefund = async () => {
    if (!esimDetails?.esimTranNo || !esimDetails?.transactionId) {
      return showErrorToast("Missing required transaction details.");
    }

    const result = await dispatch(
      cancelAndRefund({
        esimTranNo: esimDetails.esimTranNo,
        transactionId: esimDetails.transactionId,
        refund: isRefundable,
      })
    );

    if (cancelAndRefund.fulfilled.match(result)) {
      const toastMessage = isRefundable
        ? "Your eSIM has been cancelled and the refund has been processed."
        : "Your eSIM has been cancelled";
      showSuccessToast(toastMessage);
      onComplete(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {isRefundable ? "Cancel and Refund" : "Cancel eSIM"}
      </h3>

      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        This action will cancel the selected eSIM
        {isRefundable ? " and refund the amount back to your wallet." : " and refund is not applicable."} Once cancelled,
        the eSIM will be permanently deactivated and cannot be recovered.
      </p>

      <button
        onClick={handleCancelAndRefund}
        disabled={isLoading}
        className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200
          ${isLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
          text-white focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              />
            </svg>
            Processing...
          </>
        ) : (
          isRefundable ? "Cancel and Refund" : "Cancel"
        )}
      </button>

      {error && (
        <p className="text-sm text-red-500 mt-4 bg-red-50 px-4 py-2 rounded-md border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default Action;

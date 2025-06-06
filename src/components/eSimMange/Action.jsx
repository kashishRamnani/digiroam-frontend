import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelAndRefund } from "../../features";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import RemoveConfirmationModal from "../common/RemoveConfirmation";

const Action = ({ selectedEsim, onComplete }) => {
  const dispatch = useDispatch();
  const { esimDetails, error } = useSelector((state) => state.dataPlan);
  const { loading: isLoading } = useSelector((state) => state.wallet);

  const [showConfirm, setShowConfirm] = useState(false);
  const isRefundable =
    esimDetails.smdpStatus === "RELEASED" &&
    esimDetails.esimStatus === "GOT_RESOURCE";

  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
    }
  }, [dispatch, selectedEsim]);


  const handleCancelClick = () => {
    setShowConfirm(true);
  };


  const confirmCancel = async () => {
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
      onComplete(true)
    }
    setShowConfirm(false);
  };

  return (
    <Fragment>

      <RemoveConfirmationModal
        isVisible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
        title="eSIM Cancellation"
        message="Do you want to cancel your eSIM? This action cannot be undone."
        confirmLabel="Yes, Confirm"
        className="md:right-[30%]"
        isLoading={isLoading}
      >
        {isRefundable && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 shadow-sm text-sm">
            <h4 className="text-base font-semibold mb-2 text-yellow-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01M12 5a7 7 0 017 7v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a7 7 0 017-7z" />
              </svg>
              Refund Policy Notice
            </h4>

            <p className="leading-relaxed">
              In case of eSIM cancellation, your refund will be processed after deducting applicable service and gateway charges.
              These fees are non-refundable and cover processing costs by payment partners like Stripe or PayPal.
            </p>
          </div>
        )}
      </RemoveConfirmationModal>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {isRefundable ? "Cancel and Refund" : "Cancel eSIM"}
        </h3>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          This action will cancel the selected eSIM
          {isRefundable
            ? " and refund the amount back to your wallet."
            : " and refund is not applicable."}{" "}
          Once cancelled, the eSIM will be permanently deactivated and cannot be recovered.
        </p>

        <button
          onClick={handleCancelClick}
          disabled={isLoading}
          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200
          ${isLoading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
            } Cancel ${isRefundable ? "and Refund" : "(Non-refundable)"}
          text-white focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm`
          }
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg> Processing...
            </>
          )
            : isRefundable ? "Cancel and Refund" : "Cancel (Non-refundable)"
          }
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-4 bg-red-50 px-4 py-2 rounded-md border border-red-200">
            {error}
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default Action;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {cancelAndRefund } from "../../features";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";

const Action = ({ selectedEsim }) => {
  const dispatch = useDispatch();
  const {
    esimDetails,
    loading: isLoading,
    error,
  } = useSelector((state) => state.dataPlan);

  
  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
    }
  }, [dispatch, selectedEsim]);

  const handleCancelAndRefund = () => {
    if (
     selectedEsim?.esimDetails?.esimTranNo ||
     selectedEsim?.esimDetails?.transactionId 
      
    
    ) {
      alert("Missing required transaction details.");
      return;
    }

    dispatch(
      cancelAndRefund({
        esimTranNo: esimDetails.esimTranNo,
        transactionId: esimDetails.transactionId,
       
      })
    );
  };

  return (
    <div>
      <button
        onClick={handleCancelAndRefund}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Cancel and Refund"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default Action;

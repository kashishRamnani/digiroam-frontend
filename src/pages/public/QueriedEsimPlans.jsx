import { useSelector } from "react-redux";
import { ProductList, Loader, Navbar } from "../../components";
import { useParams } from "react-router-dom";

const QueriedEsimPlans = () => {
    const { isLoading, items = [] } = useSelector((state) => state.plans);
    const { locationCode } = useParams();

    return (
        <>
            {isLoading && <Loader />}
            <Navbar />
            <div className="p-6 m-5">
                <ProductList noAction locationCode={locationCode} items={items} />
            </div>
        </>
    );
};

export default QueriedEsimPlans;
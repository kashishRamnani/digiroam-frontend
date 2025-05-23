import {
    faBan,
    faClock,
    faFileAlt,
    faMicrochip,
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

const getEsimStatus = (status, smdp) => {
    switch (`${status}-${smdp}`) {
        case "CANCEL-RELEASED":
            return {
                icon: faBan,
                color: "gray-500",
                label: "Cancelled"
            };
        case "CANCEL-DELETED":
            return {
                icon: faBan,
                color: "red-600",
                label: "Deleted"
            };
        case "GOT_RESOURCE-RELEASED":
            return {
                icon: faFileAlt,
                color: "indigo-600",
                label: "Provisioned"
            };
        case "GOT_RESOURCE-ENABLED":
            return {
                icon: faClock,
                color: "yellow-500",
                label: "Pending Activation"
            };
        case "IN_USE-ENABLED":
            return {
                icon: faMicrochip,
                color: "emerald-600",
                label: "In Use"
            };
        case "USED_UP-ENABLED":
            return {
                icon: faMicrochip,
                color: "orange-500",
                label: "Data Used Up"
            };
        default:
            return {
                icon: faQuestionCircle,
                color: "gray-400",
                label: "Unknown Status"
            };
    }
};

export default getEsimStatus;

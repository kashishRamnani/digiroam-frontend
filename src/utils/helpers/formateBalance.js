const formatBalance = (balance) => {
    if (balance === undefined || balance === null || isNaN(balance)) {
        return '0.00';
    }
    return Number(balance).toFixed(2);
}

export default formatBalance;

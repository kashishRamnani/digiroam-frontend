const getPriceWithMarkup = (price, pricePercentage) => {
    const markup = price * ((pricePercentage ?? 0) / 100);
    return Number(price + markup).toFixed(2);
};

export default getPriceWithMarkup;
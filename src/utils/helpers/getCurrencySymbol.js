const getCurrencySymbol = (currency) => {
    return currencies[String(currency).toLocaleUpperCase()];
}

const currencies = {
    USD: '$',
    PKR: 'RS. '
}

export default getCurrencySymbol;
const generaterandomTransactionId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 15; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        id += chars[randIndex];
    }
    return `wallet_${id}`;
}

export default generaterandomTransactionId;
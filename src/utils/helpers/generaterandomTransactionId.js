const generaterandomTransactionId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 17; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        id += chars[randIndex];
    }
    return id;
}

export default generaterandomTransactionId;
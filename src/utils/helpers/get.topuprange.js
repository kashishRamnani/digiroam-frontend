const getTopupRange = (minTopupRange)=>{
    return Number(minTopupRange ?? 5).toFixed(2);
}

export default getTopupRange;
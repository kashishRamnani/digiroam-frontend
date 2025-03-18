const getFormattedVolume = (volume) => {
    const gb = volume / (1024 * 1024 * 1024);
    return gb >= 1 ? `${Math.floor(gb)}GB` : `${(volume / (1024 * 1024)).toFixed(0)}MB`;
};

export default getFormattedVolume;
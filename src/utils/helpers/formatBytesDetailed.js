// Helper function to format bytes into detailed human-readable format
export const formatBytesDetailed = (bytes, useDefault = true) => {
    const GB = Math.floor(bytes / (1024 ** 3));
    const remainderAfterGB = bytes % (1024 ** 3);
    const MB = Math.floor(remainderAfterGB / (1024 ** 2));
    const remainderAfterMB = remainderAfterGB % (1024 ** 2);
    const KB = Math.floor(remainderAfterMB / 1024);

    if (useDefault) return `${GB}GB`;
    return `${GB}GB ${MB}MB ${KB}KB`;
}
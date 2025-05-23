export const formatBytesDetailed = (bytes, useDefault = true) => {
    const GB = Math.floor(bytes / (1024 ** 3));
    const remainderAfterGB = bytes % (1024 ** 3);
    const MB = Math.floor(remainderAfterGB / (1024 ** 2));
    const remainderAfterMB = remainderAfterGB % (1024 ** 2);
    const KB = Math.floor(remainderAfterMB / 1024);

    if (useDefault) {
        if (GB > 0) return `${GB}GB`;
        if (MB > 0) return `${MB}MB`;
        if (KB > 0) return `${KB}KB`;
        return `${bytes}B`;
    }

    let parts = [];
    if (GB > 0) parts.push(`${GB}GB`);
    if (MB > 0) parts.push(`${MB}MB`);
    if (KB > 0) parts.push(`${KB}KB`);
    if (parts.length === 0) return `${bytes}B`;

    return parts.join(' ');
};

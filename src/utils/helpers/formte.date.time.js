const formateDateTime = (date) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'UTC'
    };

    const formatDate = new Date(date);
    return formatDate.toLocaleString('en-US', options);
}

export default formateDateTime;

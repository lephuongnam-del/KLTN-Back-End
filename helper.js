
const filterByField = async (schema, match, start, limit) => {

    let aggregationPaginated = [
        {
            $match: match
        },
        {
            $limit: start + limit
        },
        {
            $skip: start
        }
    ];
    const result = await schema.aggregate(aggregationPaginated);
    return result;


}
const getTotal = async (schema, match) => {
    const aggregation = [
        {
            $match: match
        },
        {
            $count: "total"
        }
    ];
    let result = await schema.aggregate(aggregation);
    return result[0]?.total ? result[0].total : 0;
}

const successHandler = (msg) => {
    return { msg: msg || '' }
}

const errorHandler = (error, code, msg = 'Unknown error') => {
    switch (code) {
        case 1000:
            msg = 'Create failed. Please try again !'
            break;
        case 1001:
            msg = 'Create failed. Please update your email !!!'
            break;
        case 2000:
            msg = 'Update failed. Please try again !'
            break;
        case 200:
            // mail fail
            break;
        case 3000:
            msg = 'Remove failed. Please try again !'
            break;
        default:
            break;
    }
    return { error, code, msg }
}

module.exports = {
    filterByField,
    getTotal,
    successHandler,
    errorHandler,
}

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

module.exports = {
    filterByField,
    getTotal
}
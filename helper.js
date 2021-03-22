const filterByField = async (schema, match, sorting, start, limit) => {
    const aggregationPaginated = [
        {
            $match: match
        },
        {
            $sort: sorting
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
    return result[0].total;
}

module.exports = {
    filterByField,
    getTotal
}
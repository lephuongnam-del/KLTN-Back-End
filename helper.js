const filterByField = async (schema, filterField, start, limit) => {
    return await schema.find({ ...filterField }).skip(start).limit(limit);
}
module.exports = {
    filterByField
}
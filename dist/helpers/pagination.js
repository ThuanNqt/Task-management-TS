"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objectPagination, query, countTasks) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit);
    }
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(countTasks / objectPagination.limitItems);
    return objectPagination;
};
exports.default = paginationHelper;

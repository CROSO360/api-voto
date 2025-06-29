"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    async findAll(relations = []) {
        const options = {};
        if (relations.length > 0) {
            options.relations = relations;
        }
        return this.getRepository().find(options);
    }
    findOne(id) {
        return this.getRepository().findOne({ where: id });
    }
    async findOneBy(query, relations) {
        return this.getRepository().findOne({ where: query, relations });
    }
    async findAllBy(query, relations) {
        return this.getRepository().find({ where: query, relations });
    }
    save(entity) {
        return this.getRepository().save(entity);
    }
    saveMany(entities) {
        return this.getRepository().save(entities);
    }
    async delete(id) {
        await this.getRepository().delete(id);
    }
    count(options) {
        return this.getRepository().count(options);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=commons.service.js.map
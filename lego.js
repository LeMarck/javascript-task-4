'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var PRIORITY = ['filterIn', 'sortBy', 'limit', 'format', 'select'];

var copy = function (collection) {
    return collection.map(function (item) {
        return Object.keys(item).reduce(function (obj, key) {
            obj[key] = item[key];

            return obj;
        }, {});
    });
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var changedCollection = copy(collection);
    var firstPriority = null;
    var secondPriority = null;

    return [].slice.call(arguments, 1)
        .sort(function (first, second) {
            firstPriority = PRIORITY.indexOf(first.name);
            secondPriority = PRIORITY.indexOf(second.name);
            if (firstPriority === secondPriority) {
                return 0;
            }

            return firstPriority > secondPriority ? 1 : -1;
        })
        .reduce(function (newCollection, func) {
            return func(newCollection);
        }, changedCollection);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (item) {
            return fields.reduce(function (record, field) {
                if (item.hasOwnProperty(field)) {
                    record[field] = item[field];
                }

                return record;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (item) {
            return values.indexOf(item[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (first, second) {
            if (first[property] === second[property]) {
                return 0;
            }
            var res = first[property] > second[property] ? 1 : -1;

            return order === 'asc' ? res : -res;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (item) {
            if (item.hasOwnProperty(property)) {
                item[property] = formatter(item[property]);
            }

            return item;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        if (count < 0) {
            throw new RangeError('It is expected a positive number');
        }

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.or = function () {
        var funcs = [].slice.call(arguments);

        return function (collection) {
            return collection.filter(function (item) {
                return funcs.some(function (func) {
                    return func([item]).length !== 0;
                });
            });
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var funcs = [].slice.call(arguments);

        return function (collection) {
            return collection.filter(function (item) {
                return funcs.every(function (func) {
                    return func([item]).length !== 0;
                });
            });
        };
    };
}

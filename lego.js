'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var changedCollection = JSON.parse(JSON.stringify(collection));

    return [].slice.call(arguments, 1)
        .sort(function (first, second) {
            return first.name > second.name;
        })
        .reduce(function (acc, func) {
            return func(acc);
        }, changedCollection);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (element) {
            var friend = {};
            for (var key in element) {
                if (args.indexOf(key) !== -1) {
                    friend[key] = element[key];
                }
            }

            return friend;
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
    return function (collection) {
        return collection.filter(function (element) {
            return values.indexOf(element[property]) !== -1;
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
    return function (collection) {
        return collection.sort(function (first, second) {
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
    return function (collection) {
        return collection.map(function (element) {
            if (property in element) {
                element[property] = formatter(element[property]);
            }

            return element;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function (collection) {
        return collection.slice(0, count < 0 ? 0 : count);
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
            return collection.filter(function (elem) {
                return funcs.some(function (func) {
                    return func(collection).indexOf(elem) !== -1;
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
            return collection.filter(function (elem) {
                return funcs.every(function (func) {
                    return func(collection).indexOf(elem) !== -1;
                });
            });
        };
    };
}

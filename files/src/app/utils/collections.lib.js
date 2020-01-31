'use strict';
/* tslint:disable */
import * as $R from 'ramda'
import { Fun } from '@typed-f/function';

/**
 * Поиск по указанному полю в массиве объектов
 * @param {string} fieldName - имя поля
 * @param {any} value - значение поля
 * @returns
 */
export const getByField = (value, fieldName) => {
  const query = {};
  query[`${fieldName}`] = $R.equals(value);
  return $R.compose(
    $R.filter($R.where(query))
  )
};

export const getByFields = (objectSearch = {}) => {
  const query = {};
  const fieldsName = $R.keys(objectSearch);
  const val = $R.values(objectSearch);
  fieldsName.forEach((i, k) => {
    query[`${i}`] = $R.equals(val[k])
  });
  // query[`${fieldName}`] = $R.equals(value)
  return $R.compose(
    $R.filter($R.where(query))
  )
};

/**
 * перевод дерева объектов в линейный список объектов
 * @param tree - дерево объектов
 * @returns {Function}
 */
export const treeToList = (tree) => {
  const flatten = (children, extractChildren, level = null, parent = null) => {
    if (!children.map) return []
    return Array.prototype.concat.apply(
      children.map(x => ({ ...x, level: level || 1, parent: parent || null })),
      children.map(x => flatten(extractChildren(x) || [], extractChildren, (level || 1) + 1, x.id))
    );
  }
  const extractChildren1 = x => x.map(i => i);
  const extractChildren2 = x => x.children;

  return flatten(extractChildren1(tree), extractChildren2)
};
/**
 * Возвращяет индекс объекта в массиве объектов по указанному ключю и значению
 * @param {*} value
 * @param {*} fieldName
 */
export const getIndexByField = (value, fieldName) => {
  return $R.compose(
    $R.findIndex($R.propEq(`${fieldName}`, value))
  )
};
// возращает дочерний список объекта(поле childrens)
export const getChildrenByParentID = (id) => {
  return $R.compose(
    $R.pluck('childrens'),
    $R.filter($R.where({
      id: $R.equals(id)
    }))
  )
};
/**
 * удаляет обьъект по полю
 * @return array  возвращает
 *
 */
export const removeByField = (value, fieldName) => {
  const query = {};
  query[`${fieldName}`] = $R.complement($R.equals(value));
  return $R.compose(
    $R.filter($R.where(query))
  )
};
/**
 * удаляет обьъект по полю (антипод removeByField)
 * @return array  возвращает
 */
export const removeInvertByField = (value, fieldName) => {
  const query = {};
  query[`${fieldName}`] = $R.equals(value);
  return $R.compose(
    $R.filter($R.where(query))
  )
};
// проверяет существования ключа в объекте
export const hasKeyObj = (obj, fieldName) => {
  return $R.has(fieldName)(obj)
};

/**
 * Сравнения объектов
 * diffObjs({a: 1}, {a: 1});
 */
const groupObjBy = $R.curry($R.pipe(
  // Call groupBy with the object as pairs, passing only the value to the key function
  $R.useWith($R.groupBy, [$R.useWith($R.__, [$R.last]), $R.toPairs]),
  $R.map($R.fromPairs)
));

/**
 *
 * @type {Function|*}
 * @example
 * ```
 * const diff = diffObjs(Obj1, Obj2);
 * if (diff['difference']) {}
 * ```
 */
/* tslint:disable */
export const diffObjs = $R.pipe(
  $R.useWith($R.mergeWith($R.merge), [$R.map($R.objOf('leftValue')), $R.map($R.objOf('rightValue'))]),
  // @ts-ignore
  groupObjBy($R.cond([
    [
      $R.both($R.has('leftValue'), $R.has('rightValue')),
      $R.pipe($R.values, $R.ifElse($R.apply($R.equals), $R.always('common'), $R.always('difference')))
    ],
    [$R.has('leftValue'), $R.always('onlyOnLeft')],
    [$R.has('rightValue'), $R.always('onlyOnRight')]
  ])),
  $R.evolve({
    common: $R.map($R.prop('leftValue')),
    onlyOnLeft: $R.map($R.prop('leftValue')),
    onlyOnRight: $R.map($R.prop('rightValue'))
  })
);

/**
 * Возвращает разницу в двух массивах
 * @param old - массив со старым состоянием
 * @param curr - массив с новым состоянием
 * @return obj -
 * ```json
 * {
 *   unchanged: [], // неизмененные
 *   removed: [], // удаленные
 *   added: [] // добавленые
 *   state: []
 * }
 * ```
 */
export const diffAD = (old = [], curr = []) => {
  const result = {
    unchanged: [],
    removed: [],
    added: [],
    state: []
  }

  old.forEach(prev => {
    if (curr.indexOf(prev) >= 0) {
      result.unchanged.push(prev)
      result.state.push(prev)
    } else {
      result.removed.push(prev)
    }
  })

  curr.forEach(curr => {
    // @ts-ignore
    if (old.indexOf(curr) < 0) {
      result.added.push(curr)
      result.state.push(curr)
    }
  })

  return result
}

// @ts-ignore
// @ts-ignore
/**
 * Using it
 * Arrange the array, by "date" as String
 *
 * // sort by @date (ascending)
 * sortBy(data, { prop: "date" });
 *
 * // expected: first element
 * // { date: "2011-11-01T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab" }
 *
 * // expected: last element
 * // { date: "2011-11-31T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "Visa"}
 * If you want to ignore case sensitive, set the parser callback:
 *
 * // sort by @type (ascending) IGNORING case-sensitive
 * sortBy(data, {
 *   prop: "type",
 *   parser: (t) => t.toUpperCase()
 * });
 *
 * // expected: first element
 * // { date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "Cash" }
 *
 * // expected: last element
 * // { date: "2011-11-31T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "Visa" }
 * If you want to convert the "date" field as Date type:
 *
 * // sort by @date (descending) AS Date object
 * sortBy(data, {
 *   prop: "date",
 *   desc: true,
 *   parser: (d) => new Date(d)
 * });
 *
 * // expected: first element
 * // { date: "2011-11-31T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "Visa"}
 *
 * // expected: last element
 * // { date: "2011-11-01T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab" }
 *  Here you can play with the code: jsbin.com/lesebi
 */
// @ts-ignore
const _sortBy = () => {
  const toString = Object.prototype.toString;

  // default parser function

  const parse = (x) => x;

  // gets the item to be sorted

  const getItem = function (x) {
    const isObject = x != null && typeof x === 'object';
    const isProp = isObject && this.prop in x;
    return this.parser(isProp ? x[this.prop] : x)
  };

  /**
   * Sorts an array of elements.
   *
   * @param  {Array} array: the collection to sort
   * @param  {Object} cfg: the configuration options
   * @property {String}   cfg.prop: property name (if it is an Array of objects)
   * @property {Boolean}  cfg.desc: determines whether the sort is descending
   * @property {Function} cfg.parser: function to parse the items to expected type
   * @return {Array}
   */
  return function sortby (array, cfg) {
    if (!(array instanceof Array && array.length)) return [];
    if (toString.call(cfg) !== '[object Object]') cfg = {};
    if (typeof cfg.parser !== 'function') cfg.parser = parse;
    cfg.desc = cfg.desc ? -1 : 1;
    return array.sort((a, b) => {
      a = getItem.call(cfg, a);
      b = getItem.call(cfg, b);
      return cfg.desc * ('' + a).localeCompare(b);
      // return cfg.desc * (a < b ? -1 : +(a > b))
    })
  }
  // @ts-ignore
}

export const sortBy = _sortBy()


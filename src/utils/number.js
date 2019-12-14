
/**
 * 返回指定范围内的随机整数。
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @example utilscore.randomNum(5,10) // => 5 || 6 || 7 || 8 || 9 || 10
 */
export const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * 根据函数映射每个元素，然后返回数组的和
 * @param {Array} arr
 * @param {Function} fn
 * @example utilscore.sumBy([{num:1},{num:2},{num:3},{num:4},{num:5}],(row)=>row.num) // => 15
 */
export const sumBy = (arr, fn) => arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => addNum(acc, val), 0)

/**
 * 加法运算
 * @param {Number} a
 * @param {Number} b
 * @example utilscore.addNum(0.3 , 0.6) // => 0.9
 */
export const addNum = (a, b) => {
  var c, d, e
  try {
    c = a.toString().split(".")[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split(".")[1].length
  } catch (f) {
    d = 0
  }
  return e = Math.pow(10, Math.max(c, d)), (mulNum(a, e) + mulNum(b, e)) / e
}

/**
 * 乘法运算
 * @param {Number} a
 * @param {Number} b
 * @example utilscore.mulNum(0.3 , 1.5) // => 0.45
 */
export const mulNum = (a, b) => {
  var c = 0,
    d = a.toString(),
    e = b.toString()
  try {
    c += d.split(".")[1].length
  } catch (f) {
    // console.log(f)
  }
  try {
    c += e.split(".")[1].length
  } catch (f) { 
    // console.log(f)
  }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c)
} 

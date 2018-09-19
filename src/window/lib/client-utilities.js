function dumpObject(obj) {
  var total = ''
  if (obj === undefined) return 'UNDEFINED';
  if (obj === null) return 'NULL';
  
  for(var key in obj) {
    var val = obj[key]
    if (typeof(val) === 'object') {
      total += `${key}= { ${val} }, `
    } else if (typeof(val) === 'function') {
      total += `${key}= FUNC, `
    } else {
      total += `${key}= ${val}, `
    }
  }
  return total
}


module.exports = {
  dumpObject: dumpObject
}
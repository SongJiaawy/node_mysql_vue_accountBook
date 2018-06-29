/* @params item {Object, Array} */
export const lStorageSet = (item) => {
  if (typeof item === 'string') {
    return
  }
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      for (let name in item[i]) {
        let value = JSON.stringify(item[i][name])
        localStorage.setItem(name, value)
      }
    }
  } else {
    for (let name in item) {
      let value = JSON.stringify(item[name])
      localStorage.setItem(name, value)
    }
  }
}
/* @params item {String, Array} string */
export const lStorageGet = (item) => {
  let data = []
  if (typeof item === 'string') {
    data = JSON.parse(localStorage.getItem(item))
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      data.push(data = JSON.parse(localStorage.getItem(item[i])))
    }
  }
  return data
}
export const sStorageSet = (item) => {
  if (typeof item === 'string') {
    return
  }
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      for (let name in item[i]) {
        let value = JSON.stringify(item[i][name])
        sessionStorage.setItem(name, value)
      }
    }
  } else {
    for (let name in item) {
      let value = JSON.stringify(item[name])
      sessionStorage.setItem(name, value)
    }
  }
}
/* @params item {String, Array} string */
export const sStorageGet = (item) => {
  let data = []
  if (typeof item === 'string') {
    data = JSON.parse(sessionStorage.getItem(item))
  } else if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      data.push(data = JSON.parse(sessionStorage.getItem(item[i])))
    }
  }
  return data
}

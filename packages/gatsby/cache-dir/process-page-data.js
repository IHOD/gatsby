import { getModule } from "./modules-provider"

export default function processPageData(pageProcessors, json) {
  Object.keys(pageProcessors).forEach(key => {
    console.log(pageProcessors[key])
    const modules = pageProcessors[key].map(moduleId => getModule(moduleId))
    console.log(modules)
    runModulesOnPath(json, key.split(`.`), modules)
  })
}

function runModulesOnPath(json, path, modules) {
  let curr = json
  while (path.length > 1 && curr) {
    if (Array.isArray(curr)) {
      curr.forEach(item => {
        runModulesOnPath(item, [...path], modules)
      })
      return
    } else {
      curr = curr[path.shift()]
    }
  }

  if (curr) {
    curr[path[0]] = modules.reduce((acc, next) => next(acc), curr[path[0]])
  }
}

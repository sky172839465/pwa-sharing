import { lazy } from 'react'
import { flow, isEmpty, keys, map } from 'lodash-es'

const pages = import.meta.glob('/src/client/pages/**/index.jsx')
const routes = flow(
  () => keys(pages),
  filePaths => map(filePaths, filePath => {
    const path = filePath.replace('/src/client/pages', '').replace('/index.jsx', '').toLocaleLowerCase()
    return {
      filePath,
      pageComponent: lazy(pages[filePath]),
      path: isEmpty(path) ? '/' : path
    }
  })
)()

export default routes

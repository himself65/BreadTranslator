import log from 'electron-log'
import type { ImageLike } from 'tesseract.js'

import { init as Baidu } from './baidu'
import { init as Google } from './tesseract'

export type OCRModule = {
  // get text of the img
  recognize (url: ImageLike): Promise<string>
}
export type ModuleName = 'google' | 'baidu'
export type InitModule = () => Promise<OCRModule>
const modules = new Map<ModuleName, InitModule>()

modules.set('google', Google)
modules.set('baidu', Baidu)

export class OCR implements OCRModule {
  targetModule: OCRModule | null
  targetModulePromise: Promise<OCRModule> | null

  constructor (moduleName?: Exclude<ModuleName, 'baidu'>) {
    this.targetModule = null
    this.targetModulePromise = null
    if (moduleName) {
      this.use(moduleName)
    }
  }

  private warpCall<T = any> (method: (...args: any[]) => Promise<T>): Promise<T> {
    if (this.targetModulePromise !== null) {
      return this.targetModulePromise.then(() => method())
    } else {
      return method()
    }
  }

  // fixme(todo): add baidu OCR support
  use (moduleName: Exclude<ModuleName, 'baidu'>): this {
    const module = modules.get(moduleName)
    if (module == null) {
      log.error(`cannot find module ${moduleName}`)
    } else {
      this.targetModulePromise = module()
      this.targetModulePromise.then(module => {
        this.targetModule = module
        // remove promise
        this.targetModulePromise = null
      })
    }
    return this
  }

  async recognize (url: ImageLike): Promise<string> {
    return this.warpCall(() => this.targetModule.recognize(url))
  }
}

export default OCR

import { ClassNameMap } from '@material-ui/styles'
import { DefaultTheme } from '@material-ui/styles/defaultTheme'
import log from 'electron-log'
import type { History } from 'history'

// proxyOriginal should be initialized by `init()` function at the beginning.
export const proxyOriginal = {} as never

export type GlobalProxy = {
  createCaptureWindow (): void
  openDefaultPage (history: History): void
}

export const globalProxy = new Proxy<GlobalProxy>(proxyOriginal as never, {
  get (target: GlobalProxy, p: PropertyKey): (any) => any {
    if (!(p in target)) {
      throw new Error('this function haven\'t been initialized.')
    }
    // todo: add hooks for logger
    log.log(`globalProxy get proxyOriginal.${p.toString()}().`)
    return target[p]
  },
  set (): boolean {
    // globalProxy shouldn't be set new value.
    return false
  }
})

// eslint-disable-next-line @typescript-eslint/ban-types
type UseStyles<Props extends object = {}, ClassKey extends string = string> =
  keyof Props extends never ?
    (props?: any) => ClassNameMap<ClassKey> :
    (props: Props) => ClassNameMap<ClassKey>

// eslint-disable-next-line @typescript-eslint/ban-types
export function combineStyles<Theme = DefaultTheme, Props extends object = {}, ClassKey extends string = string> (...styles: (UseStyles<Props, ClassKey> | ClassNameMap<ClassKey>)[]) {
  return function CombineStyles (theme): ClassNameMap<ClassKey> {
    const outStyles = styles.map<ClassNameMap<ClassKey>>((arg) => {
      if (typeof arg === 'function') {
        // type UseStyles
        return arg(theme)
      } else {
        // type ClassNameMap
        return arg
      }
    })

    return outStyles.reduce((acc, val) => Object.assign(acc, val))
  }
}

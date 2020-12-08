export type Display = {
  id: number
}

export type OCRData = {
  text: string
  dataURL: string
}

export type Maybe<T> = null | undefined | T;

export type NotMaybe<T> = T

type Optional<T> = {
  [Key in keyof T]?: T[Key]
}

type Must<T> = {
  [Key in keyof T]-?: T[Key]
}

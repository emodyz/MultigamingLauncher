export default function Facade (Driver: any) {
  return <T extends {new (...args: any[]): any}>(target: T) => class extends target {
    constructor (...args: any[]) {
      super(...args)
      return new Driver()
    }
  }
}

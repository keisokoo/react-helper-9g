export const setDetectChangeHandler = function (
  inputElement: HTMLInputElement
) {
  let superProps = Object.getPrototypeOf(inputElement)
  let superSet = Object.getOwnPropertyDescriptor(superProps, 'value')!.set
  let superGet = Object.getOwnPropertyDescriptor(superProps, 'value')!.get
  let newProps = {
    get: function () {
      return superGet!.apply(this, arguments as any)
    },
    set: function (t: string) {
      var _this = this as any
      setTimeout(function () {
        _this.dispatchEvent(new Event('change'))
      }, 50)
      return superSet!.apply(this, arguments as any)
    },
  }
  Object.defineProperty(inputElement, 'value', newProps)
}
// setDetectChangeHandler(document.getElementById('hi'))
// document.getElementById('hi').value = 'test' 할떄 아래의 이벤트 실행
// document.getElementById('hi').addEventListener('change', (e) => {
//   console.log('change', e.currentTarget.value)
// })

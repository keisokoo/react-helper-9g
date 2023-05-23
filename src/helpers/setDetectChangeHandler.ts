// input value 변경시 change 이벤트를 발생시키는 함수
// react rerender없이 값을 업데이트 하기 위해 사용
// state를 사용하지 않고 input value를 변경할때 사용
export const setDetectChangeHandler = function (
  inputElement: HTMLInputElement
) {
  console.log('inputElement', inputElement)

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

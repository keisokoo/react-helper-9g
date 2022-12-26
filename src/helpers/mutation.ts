export {}
let configs = {
  childList: true,
  attributes: true,
  subtree: true,
}
function observerCallback(
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  for (const mutation of mutations) {
    console.log(mutation)
  }
}
const buttonCheckObserver = new MutationObserver(observerCallback)
const formEl = document.body.querySelector('form.files') as HTMLFormElement
if (formEl) {
  buttonCheckObserver.observe(formEl, configs)
}

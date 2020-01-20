import Vue from 'vue'

Vue.directive('longpress', {
  bind: function (el, binding, vNode) {
    // warn if the binding is not a function
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.comName
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) {
        warn += `Found in component '${compName}' `
      }
      console.warn(warn)
    }
    // initialize timer
    let pressTimer = null
    // start event to start timeout
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(function () {
          // execute the handler
          handler()
        }, 500)
      }
    }
    // cancel event to clear timeout
    const cancel = (e) => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    // handler to execute the function
    const handler = (e) => {
      window.navigator.vibrate(100)
      binding.value(e)
    }

    // add event listener
    el.addEventListener('moudedown', start)
    el.addEventListener('touchstart', start)
    // cancel timeout
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
})

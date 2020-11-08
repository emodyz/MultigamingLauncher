import test from 'ava'
import {shallowMount} from '@vue/test-utils'
import Index from '@/pages/auth/login.vue'

// // available wrapper methods/properties: https://vue-test-utils.vuejs.org/api/wrapper
let wrapper

test.beforeEach(() => {
  // available mount options: https://vue-test-utils.vuejs.org/api/options.html
  wrapper = shallowMount(Index, {
    mocks: {
      __resources: 'XXX'
    }
  })
})

test('Can enter email', async (t) => {
  const emailInput = wrapper.find('#email');

  await emailInput.setValue('root@root.com');
  t.is(emailInput.element.value, 'root@root.com');
})

test('Can enter password', async (t) => {
  const emailInput = wrapper.find('#password');

  await emailInput.setValue('password');
  t.is(emailInput.element.value, 'password');
})

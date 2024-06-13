export {}
declare global {
  const useApiKeyResultStore: typeof import('./stores/api/master/keyResult.js')['useApiKeyResultStore']
}

declare global {
  export type { Component, ComponentPublicInstance, ComputedRef, InjectionKey, PropType, Ref, VNode, WritableComputedRef } from 'vue'
}


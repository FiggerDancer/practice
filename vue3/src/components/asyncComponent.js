import { defineAsyncComponent } from 'vue';
import errorComponent from './ErrorComponent.vue';
import loadingComponent from './LoadingComponent.vue';

// const asyncModal = defineAsyncComponent(() => import('./Ref.vue'));

const asyncModalV2 = defineAsyncComponent({
    loader: () => import('./Ref.vue'),
    delay: 50000,
    timeout: 50000,
    error: errorComponent,
    loading: loadingComponent,
});

export default asyncModalV2;
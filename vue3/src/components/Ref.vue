<template>
    <div>
        <ul>
            <li 
                v-for="(item) in list"
                :ref="setRefItems"
                :key="item.id"
            >{{item.name}}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import { reactive, onMounted } from 'vue';
    const list:unknown = reactive([{name: '123', id: '1'}, {name: 'hello world!', id: '2'}]);
    const refItems:unknown[] = [];
    const setRefItems = (el:unknown) => {
        refItems.push(el);
    }
    
    onMounted(() => {
        console.log(refItems);
    })
</script>

<style scoped>

</style>
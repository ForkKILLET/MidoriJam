<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive>
            <component :is="Component"></component>
        </KeepAlive>
    </RouterView>
</template>

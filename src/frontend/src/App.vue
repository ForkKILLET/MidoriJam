<template>
    <RouterView v-slot="{ Component }">
        <Suspense>
            <component :is="Component"></component>
        </Suspense>
    </RouterView>
</template>

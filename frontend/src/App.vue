

<template>
  <RouterView />
</template>

<script setup>
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useSEO } from "./composables/useSEO";

// Configurar SEO dinámico basado en la ruta actual
const router = useRouter();
useSEO();

// Actualizar SEO cuando cambie la ruta
watch(() => router.currentRoute.value, () => {
  // Los meta tags se actualizarán automáticamente gracias a useSEO()
}, { immediate: true });
</script>

<style>
/* Estilos globales opcionales */
</style>


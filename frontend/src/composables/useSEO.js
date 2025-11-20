// frontend/src/composables/useSEO.js
import { useHead } from "@vueuse/head";
import { computed } from "vue";
import { useRoute } from "vue-router";

/**
 * Composable para manejar meta tags SEO dinámicamente
 * Usa los meta tags definidos en las rutas del router
 */
export function useSEO() {
  const route = useRoute();
  
  // Configuración base de SEO
  const baseSEO = {
    title: "Formato Único de Hoja de Vida - Colombia | Crear y Generar PDF",
    description: "Aplicación web para crear, gestionar y generar hojas de vida en Formato Único oficial requerido por entidades públicas en Colombia.",
    keywords: "hoja de vida formato único, formato único hoja de vida colombia, crear hoja de vida formato oficial, hoja de vida persona natural colombia, generar pdf hoja de vida",
    ogImage: "/assets/icon2.png",
    ogUrl: typeof window !== "undefined" ? window.location.href : "",
  };
  
  // Meta tags calculados desde la ruta actual
  const seoData = computed(() => {
    const meta = route.meta || {};
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://formatounicoenlinea.com";
    const currentUrl = typeof window !== "undefined" ? window.location.href : siteUrl + route.path;
    
    return {
      title: meta.title || baseSEO.title,
      description: meta.description || baseSEO.description,
      keywords: meta.keywords || baseSEO.keywords,
      ogTitle: meta.title || baseSEO.title,
      ogDescription: meta.description || baseSEO.description,
      ogImage: meta.ogImage || baseSEO.ogImage,
      ogUrl: currentUrl,
    };
  });
  
  // Aplicar meta tags usando @vueuse/head
  useHead({
    title: seoData.value.title,
    meta: [
      // Meta tags básicos
      {
        name: "description",
        content: seoData.value.description,
      },
      {
        name: "keywords",
        content: seoData.value.keywords,
      },
      
      // Open Graph
      {
        property: "og:title",
        content: seoData.value.ogTitle,
      },
      {
        property: "og:description",
        content: seoData.value.ogDescription,
      },
      {
        property: "og:image",
        content: seoData.value.ogImage.startsWith("http") 
          ? seoData.value.ogImage 
          : `${typeof window !== "undefined" ? window.location.origin : ""}${seoData.value.ogImage}`,
      },
      {
        property: "og:url",
        content: seoData.value.ogUrl,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:locale",
        content: "es_CO",
      },
      
      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: seoData.value.ogTitle,
      },
      {
        name: "twitter:description",
        content: seoData.value.ogDescription,
      },
      {
        name: "twitter:image",
        content: seoData.value.ogImage.startsWith("http") 
          ? seoData.value.ogImage 
          : `${typeof window !== "undefined" ? window.location.origin : ""}${seoData.value.ogImage}`,
      },
    ],
    link: [
      {
        rel: "canonical",
        href: seoData.value.ogUrl,
      },
    ],
  });
  
  return {
    seoData,
  };
}


//frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Layouts
import LayoutPublico from "../Layouts/LayoutPublico.vue";
import LayoutPrivado from "../Layouts/LayoutPrivado.vue";
import RecuperarPassword from "../views/RecuperarPassword.vue";

// Vistas públicas
import LoginViews from "../views/Login.vue";

// Vistas privadas
import Home from "../views/Home.vue";
import Hoja1 from "../views/Hoja1.vue";
import Hoja2 from "../views/Hoja2.vue";
import Hoja2Extra from "../views/Hoja2Extra.vue";
import Hoja3 from "../views/Hoja3.vue";
import VistaCompleta from "../views/VistaCompleta.vue";


// Middleware para proteger rutas
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem("token");
  token ? next() : next("/login");
};


// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Layout público (sin menú)

    /**{
      path: "/",
      component: LayoutPublico,
      children: [
        { path: "", redirect: "/login" },
        {
          path: "login",
          name: "login",
          component: LoginViews,
        }
      ]
    },*/

    {
      path: "/",
      component: LayoutPublico,
      children: [
        {
          path: "",
          redirect: "/login",
          meta: {
            title: "Formato Único de Hoja de Vida - Colombia",
            description: "Aplicación web para crear y generar hojas de vida en Formato Único oficial requerido por entidades públicas en Colombia."
          }
        },
        {
          path: "login",
          name: "login",
          component: LoginViews,
          meta: {
            title: "Iniciar Sesión - Formato Único Hoja de Vida",
            description: "Inicia sesión para acceder a tu cuenta y crear tu hoja de vida en formato único."
          }
        },
        {
          path: "recuperar-password",
          name: "recuperar-password",
          component: RecuperarPassword,
          meta: {
            title: "Recuperar Contraseña - Formato Único Hoja de Vida",
            description: "Recupera tu contraseña para acceder a tu cuenta de Formato Único de Hoja de Vida."
          }
        }
      ]
    },

    {
      path: "/panel",
      component: LayoutPrivado,
      beforeEnter: requireAuth, // opcional si deseas proteger con token
      children: [
        {
          path: "Hoja1",
          component: Hoja1,
          meta: {
            title: "Datos Personales y Formación - Formato Único",
            description: "Completa tus datos personales, formación académica e idiomas para tu hoja de vida."
          }
        },
        {
          path: "Hoja2",
          component: Hoja2,
          meta: {
            title: "Experiencia Laboral - Formato Único",
            description: "Registra tu experiencia laboral en sector público, privado o independiente."
          }
        },
        {
          path: "Hoja2Extra",
          component: Hoja2Extra,
          meta: {
            title: "Experiencia Laboral Adicional - Formato Único",
            description: "Agrega experiencias laborales adicionales a tu hoja de vida."
          }
        },
        {
          path: "Hoja3",
          component: Hoja3,
          meta: {
            title: "Resumen y Firma - Formato Único",
            description: "Revisa el resumen de tu experiencia laboral y completa tu firma digital."
          }
        },
        {
          path: "vistaCompleta",
          component: VistaCompleta,
          meta: {
            title: "Vista Completa - Formato Único Hoja de Vida",
            description: "Revisa tu hoja de vida completa y genera el PDF en formato oficial."
          }
        },
      ]
    },


  ]
});

// Configurar meta tags dinámicos
router.beforeEach((to, from, next) => {
  // Los meta tags se pueden actualizar aquí si es necesario
  next();
});

export default router;
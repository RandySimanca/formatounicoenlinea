<template>
  <div class="private-layout">
    <aside
      class="sidebar-panel"
      :class="{
        'sidebar-panel--open': sidebarOpen,
        'sidebar-panel--desktop': isDesktop,
      }"
    >
      <MenuComponent @close="handleCloseSidebar" />
    </aside>

    <div class="content-area">
      <header class="content-header">
        <button class="menu-toggle" type="button" @click="toggleSidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span>Menú</span>
        </button>
        <div class="content-header__info">
          <p>Panel de administración</p>
        </div>
      </header>

      <main class="page-wrapper">
        <RouterView />
      </main>
    </div>

    <div
      v-if="sidebarOpen && !isDesktop"
      class="sidebar-backdrop"
      @click="handleCloseSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import MenuComponent from "../components/MenuComponents.vue";

const initialDesktop =
  typeof window !== "undefined" ? window.innerWidth >= 1024 : false;
const sidebarOpen = ref(initialDesktop);
const isDesktop = ref(initialDesktop);

const evaluateViewport = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) {
    sidebarOpen.value = true;
  } else {
    sidebarOpen.value = false;
  }
};

const toggleSidebar = () => {
  if (isDesktop.value) return;
  sidebarOpen.value = !sidebarOpen.value;
};

const handleCloseSidebar = () => {
  if (isDesktop.value) return;
  sidebarOpen.value = false;
};

onMounted(() => {
  evaluateViewport();
  window.addEventListener("resize", evaluateViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", evaluateViewport);
});
</script>

<style scoped>
:global(body) {
  background-color: #f4f5f7;
}

.private-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f5f7;
}

.sidebar-panel {
  width: 280px;
  background: #111827;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 5;
}

.sidebar-panel:not(.sidebar-panel--desktop) {
  position: fixed;
  left: 0;
  transform: translateX(-100%);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
}

.sidebar-panel--open {
  transform: translateX(0) !important;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 2;
}

.content-header__info {
  color: #4b5563;
  font-size: 0.95rem;
}

.menu-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.menu-toggle svg {
  width: 20px;
  height: 20px;
}

.menu-toggle:active {
  transform: scale(0.98);
}

.page-wrapper {
  flex: 1;
  padding: 1.5rem;
  min-height: 0;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 4;
}

@media (max-width: 1023px) {
  .private-layout {
    flex-direction: column;
  }

  .content-area {
    min-height: auto;
    background-color: #4b5563;
  }

  .content-header {
    position: sticky;
    top: 0;
  }

  .menu-toggle {
    display: inline-flex;
  }

  .page-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .page-wrapper {
    padding: 0.75rem;
  }
}
</style>

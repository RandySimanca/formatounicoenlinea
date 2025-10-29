<!-- frontend/src/views/RecuperarPassword.vue -->
<template>
    <div class="recovery-wrapper">
      <div class="recovery-card">
        <!-- Header -->
        <div class="recovery-header">
          <button @click="volverAlLogin" class="btn-back">
            ← Volver al login
          </button>
          <div class="header-icon">🔐</div>
          <h2>Recuperar Contraseña</h2>
          <p class="subtitle">{{ subtituloActual }}</p>
        </div>
  
        <!-- Paso 1: Solicitar código -->
        <div v-if="pasoActual === 1" class="paso-container">
          <form @submit.prevent="solicitarCodigo" class="recovery-form">
            <div class="info-box">
              <span class="info-icon">ℹ️</span>
              <p>Ingresa tu correo electrónico y te proporcionaremos un código de 6 dígitos para recuperar tu contraseña.</p>
            </div>
  
            <div class="form-group">
              <label for="email">
                <span class="label-icon">📧</span>
                Correo Electrónico
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                required
                :disabled="cargando"
                autocomplete="email"
              />
            </div>
  
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="cargando"
            >
              <span v-if="cargando" class="spinner"></span>
              <span v-else>📨</span>
              {{ cargando ? 'Generando código...' : 'Solicitar Código' }}
            </button>
          </form>
        </div>
  
        <!-- Paso 2: Verificar código -->
        <div v-else-if="pasoActual === 2" class="paso-container">
          <form @submit.prevent="verificarCodigoRecuperacion" class="recovery-form">
            <div class="codigo-info">
              <div class="icono-codigo">🔑</div>
              <p class="email-enviado">Código generado para:</p>
              <p class="email-destino">{{ email }}</p>
            </div>
  
            <!-- Mostrar código en desarrollo -->
            <div v-if="codigoDesarrollo" class="dev-codigo">
              <div class="dev-badge">MODO DESARROLLO</div>
              <p>Tu código de recuperación es:</p>
              <div class="codigo-display">{{ codigoDesarrollo }}</div>
              <button 
                type="button" 
                @click="copiarCodigo(codigoDesarrollo)" 
                class="btn-copiar"
              >
                {{ codigoCopiado ? '✅ Copiado' : '📋 Copiar' }}
              </button>
            </div>
  
            <div class="form-group">
              <label for="codigo">
                <span class="label-icon">🔢</span>
                Código de Recuperación (6 dígitos)
              </label>
              <input
                id="codigo"
                v-model="codigo"
                type="text"
                placeholder="123456"
                maxlength="6"
                required
                :disabled="cargando"
                pattern="[0-9]{6}"
                inputmode="numeric"
                @input="formatearCodigo"
              />
              <div v-if="intentosRestantes !== null && intentosRestantes < 3" class="warning-hint">
                ⚠️ Te quedan {{ intentosRestantes }} intento(s)
              </div>
            </div>
  
            <div class="tiempo-expiracion">
              <span class="icono-tiempo">⏰</span>
              El código expira en 15 minutos
            </div>
  
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="cargando || codigo.length !== 6"
            >
              <span v-if="cargando" class="spinner"></span>
              <span v-else>✓</span>
              {{ cargando ? 'Verificando...' : 'Verificar Código' }}
            </button>
  
            <button 
              type="button" 
              @click="reenviarCodigo" 
              class="btn-secondary"
              :disabled="cargando || temporizadorReenvio > 0"
            >
              {{ temporizadorReenvio > 0 ? `Reenviar en ${temporizadorReenvio}s` : '🔄 Solicitar Nuevo Código' }}
            </button>
          </form>
        </div>
  
        <!-- Paso 3: Nueva contraseña -->
        <div v-else-if="pasoActual === 3" class="paso-container">
          <form @submit.prevent="restablecerPassword" class="recovery-form">
            <div class="success-box">
              <span class="success-icon">✅</span>
              <p>Código verificado correctamente. Ahora puedes establecer tu nueva contraseña.</p>
            </div>
  
            <div class="form-group">
              <label for="nuevaPassword">
                <span class="label-icon">🔒</span>
                Nueva Contraseña
              </label>
              <div class="input-wrapper">
                <input
                  id="nuevaPassword"
                  v-model="nuevaPassword"
                  :type="mostrarNueva ? 'text' : 'password'"
                  placeholder="Mínimo 6 caracteres"
                  required
                  :disabled="cargando"
                  @input="validarPassword"
                />
                <button
                  type="button"
                  class="toggle-visibility"
                  @click="mostrarNueva = !mostrarNueva"
                  tabindex="-1"
                >
                  {{ mostrarNueva ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              
              <!-- Indicador de fortaleza -->
              <div class="password-strength" v-if="nuevaPassword">
                <div class="strength-bar">
                  <div 
                    class="strength-fill" 
                    :class="`strength-${fortaleza}`"
                    :style="{ width: `${fortalezaPorcentaje}%` }"
                  ></div>
                </div>
                <span class="strength-text" :class="`strength-${fortaleza}`">
                  {{ fortalezaTexto }}
                </span>
              </div>
            </div>
  
            <div class="form-group">
              <label for="confirmarPassword">
                <span class="label-icon">✅</span>
                Confirmar Nueva Contraseña
              </label>
              <div class="input-wrapper">
                <input
                  id="confirmarPassword"
                  v-model="confirmarPassword"
                  :type="mostrarConfirmar ? 'text' : 'password'"
                  placeholder="Repite tu nueva contraseña"
                  required
                  :disabled="cargando"
                />
                <button
                  type="button"
                  class="toggle-visibility"
                  @click="mostrarConfirmar = !mostrarConfirmar"
                  tabindex="-1"
                >
                  {{ mostrarConfirmar ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div v-if="confirmarPassword && nuevaPassword !== confirmarPassword" class="error-hint">
                ⚠️ Las contraseñas no coinciden
              </div>
            </div>
  
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="cargando || !formularioValido"
            >
              <span v-if="cargando" class="spinner"></span>
              <span v-else>💾</span>
              {{ cargando ? 'Guardando...' : 'Restablecer Contraseña' }}
            </button>
          </form>
        </div>
  
        <!-- Mensaje de error/éxito -->
        <div v-if="mensaje" class="mensaje" :class="mensajeTipo">
          <span class="mensaje-icon">{{ mensajeTipo === 'error' ? '❌' : '✅' }}</span>
          {{ mensaje }}
        </div>
  
        <!-- Indicador de pasos -->
        <div class="pasos-indicador">
          <div 
            v-for="paso in 3" 
            :key="paso"
            class="paso-dot"
            :class="{ 
              'activo': pasoActual === paso,
              'completado': pasoActual > paso
            }"
          >
            {{ paso }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '../api/axios';
  
  const router = useRouter();
  
  // Estados del formulario
  const pasoActual = ref(1);
  const email = ref('');
  const codigo = ref('');
  const nuevaPassword = ref('');
  const confirmarPassword = ref('');
  const tokenRecuperacion = ref('');
  const cargando = ref(false);
  const mensaje = ref('');
  const mensajeTipo = ref('');
  const intentosRestantes = ref(null);
  const temporizadorReenvio = ref(0);
  const codigoDesarrollo = ref('');
  const codigoCopiado = ref(false);
  
  // Control de visibilidad
  const mostrarNueva = ref(false);
  const mostrarConfirmar = ref(false);
  
  // Subtítulos por paso
  const subtituloActual = computed(() => {
    const subtitulos = {
      1: 'Ingresa tu correo para recibir un código de recuperación',
      2: 'Ingresa el código de 6 dígitos que recibiste',
      3: 'Crea una nueva contraseña segura'
    };
    return subtitulos[pasoActual.value];
  });
  
  // Validaciones de contraseña
  const tieneNumero = computed(() => /\d/.test(nuevaPassword.value));
  const tieneMayuscula = computed(() => /[A-Z]/.test(nuevaPassword.value));
  const tieneEspecial = computed(() => /[@$!%*?&#]/.test(nuevaPassword.value));
  
  const fortaleza = computed(() => {
    const pass = nuevaPassword.value;
    if (pass.length === 0) return 'vacio';
    
    let puntos = 0;
    if (pass.length >= 6) puntos++;
    if (pass.length >= 10) puntos++;
    if (tieneNumero.value) puntos++;
    if (tieneMayuscula.value) puntos++;
    if (tieneEspecial.value) puntos++;
    
    if (puntos <= 2) return 'debil';
    if (puntos <= 3) return 'media';
    return 'fuerte';
  });
  
  const fortalezaPorcentaje = computed(() => {
    const niveles = { vacio: 0, debil: 33, media: 66, fuerte: 100 };
    return niveles[fortaleza.value] || 0;
  });
  
  const fortalezaTexto = computed(() => {
    const textos = { vacio: '', debil: 'Débil', media: 'Media', fuerte: 'Fuerte' };
    return textos[fortaleza.value] || '';
  });
  
  const formularioValido = computed(() => {
    return (
      nuevaPassword.value.length >= 6 &&
      nuevaPassword.value === confirmarPassword.value
    );
  });
  
  // Formatear código (solo números)
  const formatearCodigo = (event) => {
    codigo.value = event.target.value.replace(/\D/g, '');
  };
  
  // Paso 1: Solicitar código
  const solicitarCodigo = async () => {
    mensaje.value = '';
    mensajeTipo.value = '';
    cargando.value = true;
  
    try {
      const response = await api.post('/recovery/solicitar', {
        email: email.value.toLowerCase().trim()
      });
  
      if (response.data.codigoGenerado) {
        pasoActual.value = 2;
        mensaje.value = 'Código generado correctamente';
        mensajeTipo.value = 'success';
        
        // En desarrollo, mostrar el código
        if (response.data.codigoDesarrollo) {
          codigoDesarrollo.value = response.data.codigoDesarrollo;
          console.log('🔑 Código de desarrollo:', response.data.codigoDesarrollo);
        }
        
        iniciarTemporizadorReenvio();
      } else {
        mensaje.value = 'Si el correo existe, se ha generado un código de recuperación';
        mensajeTipo.value = 'info';
      }
  
    } catch (error) {
      console.error('Error al solicitar código:', error);
      mensaje.value = error.response?.data?.mensaje || 'Error al generar el código';
      mensajeTipo.value = 'error';
    } finally {
      cargando.value = false;
    }
  };
  
  // Paso 2: Verificar código
  const verificarCodigoRecuperacion = async () => {
    mensaje.value = '';
    mensajeTipo.value = '';
    cargando.value = true;
  
    try {
      const response = await api.post('/recovery/verificar', {
        email: email.value.toLowerCase().trim(),
        codigo: codigo.value
      });
  
      tokenRecuperacion.value = response.data.tokenRecuperacion;
      pasoActual.value = 3;
      mensaje.value = 'Código verificado correctamente';
      mensajeTipo.value = 'success';
      intentosRestantes.value = null;
  
    } catch (error) {
      console.error('Error al verificar código:', error);
      const errorData = error.response?.data;
      mensaje.value = errorData?.mensaje || 'Código incorrecto';
      mensajeTipo.value = 'error';
      
      if (errorData?.intentosRestantes !== undefined) {
        intentosRestantes.value = errorData.intentosRestantes;
      }
    } finally {
      cargando.value = false;
    }
  };
  
  // Paso 3: Restablecer contraseña
  const restablecerPassword = async () => {
    if (!formularioValido.value) {
      mensaje.value = 'Por favor completa todos los campos correctamente';
      mensajeTipo.value = 'error';
      return;
    }
  
    mensaje.value = '';
    mensajeTipo.value = '';
    cargando.value = true;
  
    try {
      await api.post('/recovery/restablecer', {
        email: email.value.toLowerCase().trim(),
        tokenRecuperacion: tokenRecuperacion.value,
        nuevaPassword: nuevaPassword.value
      });
  
      mensaje.value = '¡Contraseña restablecida exitosamente! Redirigiendo al login...';
      mensajeTipo.value = 'success';
  
      setTimeout(() => {
        router.push('/login');
      }, 2000);
  
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      mensaje.value = error.response?.data?.mensaje || 'Error al restablecer la contraseña';
      mensajeTipo.value = 'error';
    } finally {
      cargando.value = false;
    }
  };
  
  // Reenviar código
  const reenviarCodigo = async () => {
    codigo.value = '';
    codigoDesarrollo.value = '';
    intentosRestantes.value = null;
    await solicitarCodigo();
  };
  
  // Temporizador de reenvío
  const iniciarTemporizadorReenvio = () => {
    temporizadorReenvio.value = 60;
    const intervalo = setInterval(() => {
      temporizadorReenvio.value--;
      if (temporizadorReenvio.value <= 0) {
        clearInterval(intervalo);
      }
    }, 1000);
  };
  
  // Copiar código
  const copiarCodigo = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      codigoCopiado.value = true;
      setTimeout(() => {
        codigoCopiado.value = false;
      }, 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };
  
  // Validar password
  const validarPassword = () => {
    mensaje.value = '';
    mensajeTipo.value = '';
  };
  
  // Volver al login
  const volverAlLogin = () => {
    router.push('/login');
  };
  </script>
  
  <style scoped>
  .recovery-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .recovery-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .recovery-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
    position: relative;
  }
  
  .btn-back {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s;
  }
  
  .btn-back:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .header-icon {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  
  .recovery-header h2 {
    margin: 0 0 10px;
    font-size: 1.8rem;
  }
  
  .subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }
  
  .paso-container {
    padding: 30px;
  }
  
  .recovery-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-box,
  .success-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 10px;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
  }
  
  .success-box {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }
  
  .info-icon,
  .success-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }
  
  .codigo-info {
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
  }
  
  .icono-codigo {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  
  .email-enviado {
    margin: 0 0 5px;
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .email-destino {
    margin: 0;
    font-weight: 600;
    color: #1f2937;
    font-size: 1.1rem;
  }
  
  .dev-codigo {
    background: #fef3c7;
    border: 2px dashed #f59e0b;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .dev-badge {
    background: #f59e0b;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 10px;
  }
  
  .codigo-display {
    font-size: 2rem;
    font-weight: 700;
    color: #92400e;
    letter-spacing: 0.5rem;
    margin: 15px 0;
    font-family: 'Courier New', monospace;
  }
  
  .btn-copiar {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
  }
  
  .btn-copiar:hover {
    background: #d97706;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }
  
  .label-icon {
    font-size: 1.1rem;
  }
  
  .form-group input {
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .form-group input:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
  
  .input-wrapper {
    position: relative;
    display: flex;
  }
  
  .input-wrapper input {
    width: 100%;
    padding-right: 45px;
  }
  
  .toggle-visibility {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  
  .toggle-visibility:hover {
    opacity: 1;
  }
  
  .password-strength {
    margin-top: 8px;
  }
  
  .strength-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 5px;
  }
  
  .strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 3px;
  }
  
  .strength-fill.strength-debil {
    background: #ef4444;
  }
  
  .strength-fill.strength-media {
    background: #f59e0b;
  }
  
  .strength-fill.strength-fuerte {
    background: #10b981;
  }
  
  .strength-text {
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .strength-text.strength-debil {
    color: #ef4444;
  }
  
  .strength-text.strength-media {
    color: #f59e0b;
  }
  
  .strength-text.strength-fuerte {
    color: #10b981;
  }
  
  .error-hint,
  .warning-hint {
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 5px;
  }
  
  .error-hint {
    color: #ef4444;
  }
  
  .warning-hint {
    color: #f59e0b;
  }
  
  .tiempo-expiracion {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #6b7280;
    font-size: 0.9rem;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .icono-tiempo {
    font-size: 1.1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
  }
  
  .btn-primary:disabled,
  .btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .mensaje {
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 10px;
  }
  
  .mensaje.error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }
  
  .mensaje.success {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
  
  .mensaje.info {
    background: #eff6ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
  
  .mensaje-icon {
    font-size: 1.2rem;
  }
  
  .pasos-indicador {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #e2e8f0;
  }
  
  .paso-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    background: #e2e8f0;
    color: #6b7280;
    transition: all 0.3s;
  }
  
  .paso-dot.activo {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.1);
  }
  
  .paso-dot.completado {
    background: #10b981;
    color: white;
  }
  
  @media (max-width: 600px) {
    .recovery-wrapper {
      padding: 10px;
    }
  
    .recovery-card {
      border-radius: 12px;
    }
  
    .recovery-header {
      padding: 20px;
    }
  
    .paso-container {
      padding: 20px;
    }
  
    .btn-back {
      font-size: 0.8rem;
      padding: 6px 12px;
    }
  }
  </style>
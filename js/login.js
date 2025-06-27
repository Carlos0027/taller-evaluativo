const form = document.getElementById('loginForm');
const userInput = document.getElementById('username');
const passInput = document.getElementById('password');
const alertContainer = document.getElementById('alertContainer');

let intentos = parseInt(localStorage.getItem('intentos')) || 0;
let bloqueoHasta = localStorage.getItem('bloqueoHasta');

function mostrarAlerta(mensaje, tipo = "danger") {
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function estaBloqueado() {
  const ahora = new Date().getTime();
  return bloqueoHasta && ahora < parseInt(bloqueoHasta);
}

function mostrarTiempoRestante() {
  const ahora = new Date().getTime();
  const restante = Math.ceil((parseInt(bloqueoHasta) - ahora) / 1000);
  mostrarAlerta(`Has excedido los intentos. Intenta nuevamente en ${restante} segundos.`, "warning");
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (estaBloqueado()) {
    mostrarTiempoRestante();
    return;
  }

  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (pass === "adso2993013") {
    localStorage.setItem('usuario', user);
    localStorage.removeItem('intentos');
    localStorage.removeItem('bloqueoHasta');
    window.location.href = "index.html";
  } else {
    intentos++;
    localStorage.setItem('intentos', intentos);

    if (intentos >= 3) {
      const espera = new Date().getTime() + 60000; // 1 minuto
      localStorage.setItem('bloqueoHasta', espera);
      mostrarAlerta("Has excedido los 3 intentos. Debes esperar 1 minuto para volver a intentar.", "danger");
    } else {
      mostrarAlerta(`Contraseña incorrecta. Intento ${intentos} de 3.`, "warning");
    }
  }
});

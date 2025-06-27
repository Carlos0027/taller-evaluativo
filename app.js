const usuario = localStorage.getItem('usuario');
if (!usuario) {
  window.location.href = "login.html";
} else {
  document.getElementById("nombreUsuario").textContent = usuario;
}

document.getElementById("btnSalir").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

const tablaBody = document.getElementById("tablaBody");
const selectFicha = document.getElementById("selectFicha");
const programaInput = document.getElementById("programaNombre");
const buscador = document.getElementById("buscador");

let aprendices = [];

fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/main/SENA-CTPI.matriculados.json")
  .then(res => res.json())
  .then(data => {
    aprendices = data;
    cargarFichas();
  })
  .catch(err => {
    console.error("Error al cargar los datos:", err);
    tablaBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">No se pudo cargar la información</td></tr>`;
  });

function cargarFichas() {
  const fichasUnicas = [...new Set(aprendices.map(a => a.FICHA))];
  selectFicha.innerHTML = fichasUnicas.map(f => `<option value="${f}">${f}</option>`).join("");

  mostrarAprendicesPorFicha(fichasUnicas[0]);

  selectFicha.addEventListener("change", () => {
    mostrarAprendicesPorFicha(selectFicha.value);
  });
}

function mostrarAprendicesPorFicha(ficha) {
  const filtrados = aprendices.filter(a => a.FICHA == ficha);
  tablaBody.innerHTML = "";

  if (filtrados.length > 0) {
    programaInput.value = filtrados[0].PROGRAMA;

    filtrados.forEach(a => {
      const fila = document.createElement("tr");

      const estado = a.ESTADO_APRENDIZ?.toLowerCase();
      if (estado && (estado.includes("retiro") || estado.includes("cancelado"))) {
        fila.classList.add("resaltado");
      }

      fila.innerHTML = `
        <td>${a.TIPO_DOCUMENTO || ""}</td>
        <td>${a.NUMERO_DOCUMENTO || ""}</td>
        <td>${a.NOMBRE || ""}</td>
        <td>${a.PRIMER_APELLIDO || ""}</td>
        <td>${a.SEGUNDO_APELLIDO || ""}</td>
        <td>${a.ESTADO_APRENDIZ || ""}</td>
      `;
      tablaBody.appendChild(fila);
    });


    localStorage.setItem("codigo_ficha", ficha);
    localStorage.setItem("programa", filtrados[0].PROGRAMA);
    localStorage.setItem("nivel", filtrados[0].NIVEL_DE_FORMACION);
    localStorage.setItem("estado_ficha", filtrados[0].ESTADO_FICHA);
  }
}

buscador.addEventListener("input", function () {
  const texto = this.value.toLowerCase().trim();

  const resultados = aprendices.filter(a =>
    a.FICHA.toString().includes(texto) ||
    a.PROGRAMA.toLowerCase().includes(texto)
  );

  if (resultados.length > 0) {
    programaInput.value = resultados[0].PROGRAMA;
    mostrarResultados(resultados);
  } else {
    tablaBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron resultados</td></tr>`;
  }
});

function mostrarResultados(lista) {
  tablaBody.innerHTML = "";

  lista.forEach(a => {
    const fila = document.createElement("tr");

    const estado = a.ESTADO_APRENDIZ?.toLowerCase();
    if (estado && (estado.includes("retiro") || estado.includes("cancelado"))) {
      fila.classList.add("resaltado");
    }

    fila.innerHTML = `
      <td>${a.TIPO_DOCUMENTO || ""}</td>
      <td>${a.NUMERO_DOCUMENTO || ""}</td>
      <td>${a.NOMBRE || ""}</td>
      <td>${a.PRIMER_APELLIDO || ""}</td>
      <td>${a.SEGUNDO_APELLIDO || ""}</td>
      <td>${a.ESTADO_APRENDIZ || ""}</td>
    `;
    tablaBody.appendChild(fila);
  });
}

(() => {
  const form = document.getElementById("laberinto-form");
  const contenedor = document.getElementById("contenedor-matriz");

  // 🎯 Generar matriz al hacer clic
  document.getElementById("generar-matriz")?.addEventListener("click", () => {
    const filas = parseInt(document.getElementById("num_filas").value, 10);
    const columnas = parseInt(document.getElementById("num_columnas").value, 10);

    // Validación de dimensiones
    if (filas > 10 || columnas > 10 || filas < 1 || columnas < 1) {
      alert("⚠️ Tamaño máximo permitido: 10x10");
      return;
    }

    // Confirmar si ya hay matriz generada
    if (contenedor.children.length > 0) {
      const confirmar = confirm("¿Deseas reemplazar la matriz actual?");
      if (!confirmar) return;
    }

    contenedor.innerHTML = "";

    // 📦 Contenedor externo para centrar
    const wrapperExterno = document.createElement("div");
    wrapperExterno.classList.add("w-100", "d-flex", "justify-content-center");

    // 📦 Contenedor interno para estilo visual
    const tablaWrapper = document.createElement("div");
    tablaWrapper.classList.add("bg-light", "p-3", "rounded", "border", "fade-in");
    tablaWrapper.style.width = "100%";
    tablaWrapper.style.maxWidth = "800px";
    tablaWrapper.style.display = "flex";
    tablaWrapper.style.justifyContent = "center";

    // 🧱 Tabla de inputs
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "bg-white", "shadow-sm");
    table.style.textAlign = "center";
    table.style.width = "auto";

    for (let i = 0; i < filas; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < columnas; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.required = true;
        input.classList.add("form-control", "text-center", "p-2", "rounded");
        input.style.width = "70px";
        input.style.height = "50px";
        input.style.fontSize = "1.2rem";
        input.name = `cell-${i}-${j}`;
        cell.appendChild(input);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    tablaWrapper.appendChild(table);
    wrapperExterno.appendChild(tablaWrapper);
    contenedor.appendChild(wrapperExterno);
  });

  // ✅ Armar el string de la matriz antes de enviar
  form?.addEventListener("submit", (event) => {
    const filas = parseInt(document.getElementById("num_filas").value, 10);
    const columnas = parseInt(document.getElementById("num_columnas").value, 10);
    let texto = "";

    document.querySelectorAll("input").forEach(i => i.classList.remove("is-invalid"));

    try {
      for (let i = 0; i < filas; i++) {
        let fila = [];
        for (let j = 0; j < columnas; j++) {
          const input = document.querySelector(`[name="cell-${i}-${j}"]`);
          const val = input.value;
          if (!val) {
            input.classList.add("is-invalid");
            throw new Error("Completa todos los valores de la matriz.");
          }
          fila.push(parseInt(val, 10));
        }
        texto += fila.join(" ") + "\n";
      }
      document.getElementById("matriz").value = texto.trim();
    } catch (err) {
      alert(err.message);
      event.preventDefault();
    }
  });

  // 🔁 Botón reset
  document.getElementById("btn-reset")?.addEventListener("click", () => {
    window.location.href = "/";
  });


  // 🧠 Reconstruir visualmente desde el input oculto
  window.addEventListener("DOMContentLoaded", () => {
    const matrizTexto = document.getElementById("matriz").value.trim();
    if (matrizTexto) {
      const filasArray = matrizTexto.split("\n");
      const numFilas = filasArray.length;
      const numColumnas = filasArray[0].trim().split(/\s+/).length;

      document.getElementById("num_filas").value = numFilas;
      document.getElementById("num_columnas").value = numColumnas;

      document.getElementById("generar-matriz").click();

      setTimeout(() => {
        for (let i = 0; i < numFilas; i++) {
          const valores = filasArray[i].trim().split(/\s+/);
          for (let j = 0; j < numColumnas; j++) {
            const input = document.querySelector(`[name="cell-${i}-${j}"]`);
            if (input) input.value = valores[j];
          }
        }
      }, 50);
    }
  });
    // 💾 Guardar laberinto en archivo .txt
  document.getElementById("btn-guardar")?.addEventListener("click", () => {
    const matrizTexto = document.getElementById("matriz").value.trim();
    if (!matrizTexto) {
      alert("⚠️ No hay laberinto para guardar.");
      return;
    }

    const blob = new Blob([matrizTexto], { type: "text/plain" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "laberinto.txt";
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  });

  // 📂 Cargar archivo de laberinto
  document.getElementById("input-cargar")?.addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      const contenido = evento.target.result.trim();
      const filasArray = contenido.split("\n");
      const numFilas = filasArray.length;
      const numColumnas = filasArray[0].trim().split(/\s+/).length;

      document.getElementById("num_filas").value = numFilas;
      document.getElementById("num_columnas").value = numColumnas;
      document.getElementById("generar-matriz").click();

      setTimeout(() => {
        for (let i = 0; i < numFilas; i++) {
          const valores = filasArray[i].trim().split(/\s+/);
          for (let j = 0; j < numColumnas; j++) {
            const input = document.querySelector(`[name="cell-${i}-${j}"]`);
            if (input) input.value = valores[j];
          }
        }
        document.getElementById("matriz").value = contenido;
      }, 50);
    };

    lector.readAsText(archivo);
  });
  document.getElementById("btn-cargar")?.addEventListener("click", () => {
    document.getElementById("input-cargar").click();
  });

})();

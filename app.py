from flask import Flask, render_template, request
from utils import encontrar_ruta

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    resultado = None
    laberinto = None
    ruta = None
    matriz_texto = ""

    if request.method == "POST":
        try:
            matriz_texto = request.form.get("matriz", "").strip()
            fila_inicio = int(request.form.get("fila_inicio"))
            columna_inicio = int(request.form.get("columna_inicio"))
            fila_fin = int(request.form.get("fila_fin"))
            columna_fin = int(request.form.get("columna_fin"))

            if not matriz_texto:
                raise ValueError("La matriz no puede estar vacía.")

            laberinto = [
                list(map(int, fila.strip().split()))
                for fila in matriz_texto.split("\n")
            ]

            filas = len(laberinto)
            columnas = len(laberinto[0]) if filas > 0 else 0

            if any(len(fila) != columnas for fila in laberinto):
                raise ValueError("La matriz debe ser rectangular.")

            if filas > 10 or columnas > 10:
                raise ValueError("Tamaño máximo permitido: 10x10.")

            if not (0 <= fila_inicio < filas and 0 <= columna_inicio < columnas):
                raise ValueError("La celda de inicio está fuera del rango.")
            if not (0 <= fila_fin < filas and 0 <= columna_fin < columnas):
                raise ValueError("La celda final está fuera del rango.")

            ruta = encontrar_ruta(laberinto, (fila_inicio, columna_inicio), (fila_fin, columna_fin))

            resultado = (
                "Ruta encontrada: " + " → ".join([f"({x},{y})" for x, y in ruta])
                if ruta else "❌ No se encontró una ruta válida."
            )

        except ValueError as ve:
            resultado = f"⚠️ {str(ve)}"
        except Exception as e:
            resultado = f"⚠️ Error inesperado: {str(e)}"


    return render_template("index.html", resultado=resultado, laberinto=laberinto, ruta=ruta, matriz_texto=matriz_texto)

if __name__ == "__main__":
    app.run(debug=True)

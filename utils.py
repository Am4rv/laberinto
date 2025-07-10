def encontrar_ruta(laberinto, inicio, fin):
    filas = len(laberinto)
    columnas = len(laberinto[0]) if filas > 0 else 0
    visitado = set()

    def es_valido(x, y):
        return 0 <= x < filas and 0 <= y < columnas

    def dfs(pos_actual):
        if pos_actual == fin:
            return [pos_actual]

        x, y = pos_actual
        visitado.add(pos_actual)
        current_val = laberinto[x][y]

        # Movimientos posibles: arriba, abajo, izquierda, derecha
        movimientos = [(x-1,y), (x+1,y), (x,y-1), (x,y+1)]

        for nx, ny in movimientos:
            if es_valido(nx, ny) and (nx, ny) not in visitado:
                next_val = laberinto[nx][ny]
                if current_val % next_val == 0:
                    ruta = dfs((nx, ny))
                    if ruta:
                        return [pos_actual] + ruta

        visitado.remove(pos_actual)
        return None

    return dfs(inicio)

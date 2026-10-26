import { describe, expect, it } from "vitest";
import { calcularEstadisticas, mesesRecientes } from "../utils/estadisticas";

const hoy = new Date(2026, 9, 15); // octubre de 2026

describe("mesesRecientes", () => {
  it("devuelve los últimos N meses, del más viejo al actual", () => {
    const m = mesesRecientes(3, hoy);
    expect(m.map((x) => x.clave)).toEqual(["2026-08", "2026-09", "2026-10"]);
  });
  it("cruza el cambio de año", () => {
    expect(mesesRecientes(2, new Date(2026, 0, 10)).map((x) => x.clave)).toEqual(["2025-12", "2026-01"]);
  });
});

describe("calcularEstadisticas", () => {
  const movs = [
    { tipo: "ingreso", moneda: "UYU", monto: 1000, fecha: "2026-10-04T00:00:00.000Z" },
    { tipo: "egreso", moneda: "USD", monto: 10, montoConvertidoUYU: 400, fecha: "2026-10-05T00:00:00.000Z", categoria: { nombre: "Software" } },
    { tipo: "egreso", moneda: "EUR", monto: 5, montoConvertidoUYU: null, fecha: "2026-10-06T00:00:00.000Z" },
    { tipo: "egreso", moneda: "UYU", monto: 50, fecha: "2025-01-01T00:00:00.000Z" },
  ];
  const r = calcularEstadisticas(movs, 3, hoy);

  it("suma en pesos y calcula el balance", () => {
    expect(r.totales).toEqual({ ingresos: 1000, egresos: 400, balance: 600 });
  });
  it("cuenta aparte lo que no tiene cotización y deja afuera lo fuera de rango", () => {
    expect(r.sinCotizacion).toBe(1);
    expect(r.cantidad).toBe(3);
  });
  it("agrupa los egresos por categoría", () => {
    expect(r.categorias).toEqual([{ nombre: "Software", monto: 400 }]);
  });
  it("agrupa las categorías menores en \"Otras\"", () => {
    const muchas = Array.from({ length: 8 }, (_, i) => ({ tipo: "egreso", moneda: "UYU", monto: 10 + i, fecha: "2026-10-01T00:00:00.000Z", categoria: { nombre: `C${i}` } }));
    const c = calcularEstadisticas(muchas, 1, hoy).categorias;
    expect(c).toHaveLength(6);
    expect(c.at(-1).nombre).toBe("Otras");
  });
});

import { describe, expect, it } from "vitest";
import { parsearQrCfe } from "../utils/qrCfe";

describe("parsearQrCfe", () => {
  it("reconoce los datos de un QR de la DGI", () => {
    const r = parsearQrCfe("https://www.efactura.dgi.gub.uy/consultaQR/cfe?219999830019,101,A,457,1250.50,15/10/2026,abcd1234");
    expect(r).toEqual({ rut: "219999830019", serie: "A", numero: "457", fecha: "2026-10-15", monto: 1250.5 });
  });
  it("rechaza códigos que no apuntan a la DGI", () => {
    expect(parsearQrCfe("https://sitio-falso.com/consultaQR/cfe?219999830019,101,A,457,10.00,15/10/2026")).toBeNull();
  });
  it("rechaza texto que no es una dirección o no trae RUT", () => {
    expect(parsearQrCfe("hola")).toBeNull();
    expect(parsearQrCfe("https://www.efactura.dgi.gub.uy/consultaQR/cfe?A,457")).toBeNull();
  });
});

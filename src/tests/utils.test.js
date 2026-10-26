import { beforeEach, describe, expect, it } from "vitest";
import { nombreVisible } from "../utils/formato";
import { nombrePlan } from "../utils/planes";
import { decodificarToken, tokenVigente } from "../utils/token";

const crearToken = (payload) => `x.${btoa(JSON.stringify(payload))}.y`;

describe("token", () => {
  it("decodifica el payload", () => {
    expect(decodificarToken(crearToken({ id: "1", tipo: "usuario" })).tipo).toBe("usuario");
  });
  it("un token roto no explota", () => {
    expect(decodificarToken("basura")).toBeNull();
    expect(tokenVigente("basura")).toBe(false);
  });
  it("reconoce tokens vencidos y vigentes", () => {
    const ahora = Math.floor(Date.now() / 1000);
    expect(tokenVigente(crearToken({ exp: ahora - 10 }))).toBe(false);
    expect(tokenVigente(crearToken({ exp: ahora + 3600 }))).toBe(true);
  });
});

describe("planes", () => {
  it("traduce los ids y respeta los alias viejos", () => {
    expect(nombrePlan("boutique")).toBe("Estudio Boutique");
    expect(nombrePlan("plus")).toBe("Gratuito");
    expect(nombrePlan("premium")).toBe("Directo Premium");
    expect(nombrePlan("desconocido")).toBe("desconocido");
  });
});

describe("nombreVisible", () => {
  beforeEach(() => {});
  it("saca el sufijo técnico de los perfiles creados por el estudio", () => {
    expect(nombreVisible({ nombreUsuario: "juan.ab12cd" })).toBe("juan");
    expect(nombreVisible({ nombreUsuario: "maria" })).toBe("maria");
  });
});

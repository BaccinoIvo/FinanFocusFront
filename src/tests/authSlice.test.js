import { describe, expect, it } from "vitest";
import reducer, { logout } from "../store/authSlice";

describe("authSlice", () => {
  const conSesion = { token: "t", usuario: { id: "1" }, cargando: false, error: null, vencida: false };

  it("logout limpia la sesión", () => {
    const s = reducer(conSesion, logout());
    expect(s.token).toBeNull();
    expect(s.usuario).toBeNull();
    expect(s.vencida).toBe(false);
  });
  it("logout({ vencida: true }) marca que la sesión venció", () => {
    expect(reducer(conSesion, logout({ vencida: true })).vencida).toBe(true);
  });
});

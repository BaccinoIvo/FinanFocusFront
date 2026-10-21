import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.model.js";


export const cambiarPlan = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.user.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (usuario.plan === "premium") {
            return res.status(400).json({ message: "El usuario ya tiene plan premium" });
        }

        usuario.plan = "premium";
        await usuario.save();

        // El plan viaja dentro del JWT, así que se emite uno nuevo con el plan actualizado.
        // Sin esto, el token viejo seguiría diciendo "plus" hasta volver a iniciar sesión.
        const token = jwt.sign(
            { id: usuario._id, nombreUsuario: usuario.nombreUsuario, tipo: usuario.tipo, plan: usuario.plan },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Plan actualizado a premium", data: { plan: usuario.plan }, token });
    } catch (error) {
        next(error);
    }
};

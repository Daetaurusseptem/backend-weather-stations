export const cleanInvalidFields = function (doc: any, camposNumericos: string[]) {
    camposNumericos.forEach((campo) => {
      const valor = doc[campo];
      if (valor !== undefined && valor <= 0) {
        // Eliminar el campo del documento usando 'set' para mayor compatibilidad con Mongoose
        doc.set(campo, undefined);
        console.log(`Campo "${campo}" eliminado por tener valor inválido: ${valor}`);
      }
    });
  };
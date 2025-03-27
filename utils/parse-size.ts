export const parseSize = (size?: number) => {
    switch (size) {
      case 1:
        return { label: "Pequeño" };
      case 2:
        return { label: "Mediano" };
      case 3:
        return { label: "Grande" };
      case 4:
        return { label: "Gigante" };
      default:
        return { label: "Desconocido" };
    }
  };
  
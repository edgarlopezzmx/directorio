import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/users"); // cambia la ruta a la página de usuarios
  }, [router]);

  return null; // no se renderiza nada en la raíz
}
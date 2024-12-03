"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/crud");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("El correo ingresado no está registrado.");
          break;
        case "auth/wrong-password":
          setError("La contraseña es incorrecta.");
          break;
        case "auth/invalid-email":
          setError("El formato del correo no es válido.");
          break;
        default:
          setError("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-14 ">
        Task Manager Pro
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h1>

        {error && (
          <div
            className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            className="text-neutral-950 mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="text-neutral-950 mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Iniciar Sesión
        </button>

        <p className="text-center text-gray-500 mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-purple-600 hover:underline">
            ¡Regístrate!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

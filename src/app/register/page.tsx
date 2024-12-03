"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("¡Las contraseñas no coinciden!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError(null);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo electrónico no tiene un formato válido.");
      } else {
        setError("Ocurrió un error. Inténtalo de nuevo.");
      }
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Crear cuenta
        </h2>

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
            Email
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

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            className="text-neutral-950 mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Registrarse
        </button>

        <p className="text-center text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </form>

      {showToast && (
        <div
          className="fixed bottom-6 right-6 bg-gray-800 text-white text-sm rounded-xl shadow-lg dark:bg-purple-600"
          role="alert"
          aria-labelledby="toast-message"
        >
          <div className="flex items-center p-4">
            <p id="toast-message" className="flex-grow">
              ¡Registro exitoso!
            </p>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="ml-4 text-white opacity-50 hover:opacity-100 focus:outline-none"
              aria-label="Cerrar"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

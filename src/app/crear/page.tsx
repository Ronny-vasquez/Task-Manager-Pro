"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

const Crear: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Debe iniciar sesión para crear una tarea.");
      router.push("/login");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        date,
        priority,
        userId: user.uid,
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        router.push("/crud");
      }, 3000);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-neutral-950 p-6">
      <div className="max-w-4xl mx-auto bg-zinc-700 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-stone-50">Crear Tarea</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border rounded"
            >
              <option value="Baja">Baja</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>

          <Link href="/crud">
            <button className="bg-gray-400 hover:bg-gray-600	 text-white font-bold py-2 px-4 rounded ml-4">
              Atras
            </button>
          </Link>
        </form>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 bg-gray-800 text-white text-sm rounded-xl shadow-lg dark:bg-sky-500"
          role="alert"
        >
          <div className="flex items-center p-4">
            <p>¡Tarea creada exitosamente!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crear;

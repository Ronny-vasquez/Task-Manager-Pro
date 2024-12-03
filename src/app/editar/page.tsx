"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  priority: string;
}

const Editar: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    const storedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );
    const selectedTask = storedTasks.find(
      (task) => task.id === parseInt(id as string)
    );

    if (selectedTask) {
      setTask(selectedTask);
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setDate(selectedTask.date);
      setPriority(selectedTask.priority);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      const updatedTask: Task = { ...task, title, description, date, priority };
      const storedTasks: Task[] = JSON.parse(
        localStorage.getItem("tasks") || "[]"
      );
      const updatedTasks = storedTasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    router.push("/crud");
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-neutral-950 p-6">
      <div className="max-w-4xl mx-auto bg-zinc-700 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-stone-50">Editar Tarea</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Titulo
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-50">
              Descripcion
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-100 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
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
              className="mt-1 w-full p-3 bg-gray-100 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
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
              className="mt-1 w-full p-3 bg-gray-100 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Selecciona Prioridad</option>
              <option value="Baja">Baja</option>
              <option value="Medio">Media</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => router.push("/crud")}
            className="bg-gray-600 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editar;

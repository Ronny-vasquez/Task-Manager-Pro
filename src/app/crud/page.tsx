"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(userTasks);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await updateDoc(doc(db, "tasks", updatedTask.id), {
        title: updatedTask.title,
        description: updatedTask.description,
        date: updatedTask.date,
        priority: updatedTask.priority,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      closeModal();
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al borrar tarea:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-stone-950 flex flex-col p-8 relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Cerrar Sesión
      </button>

      <div className="w-full max-w-7xl mx-auto bg-stone-50 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Manager Pro</h1>
          <Link href="/crear">
            <button className="bg-purple-600 text-white px-5 py-3 rounded hover:bg-purple-700 text-lg">
              + Crear Nueva Tarea
            </button>
          </Link>
        </div>

        <table className="table-auto w-full text-left text-gray-700 h-full">
          <thead>
            <tr className="border-b border-gray-300 bg-neutral-800 text-zinc-50">
              <th className="py-4 px-6 text-lg">Titulo</th>
              <th className="py-4 px-6 text-lg">Descripcion</th>
              <th className="py-4 px-6 text-lg">Fecha</th>
              <th className="py-4 px-6 text-lg">Prioridad</th>
              <th className="py-4 px-6 text-lg text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-neutral-200 border-b border-gray-200"
              >
                <td className="py-6 px-6">{task.title}</td>
                <td className="py-6 px-6">{task.description}</td>
                <td className="py-6 px-6">{task.date}</td>
                <td className="py-6 px-6">
                  <span
                    className={`px-3 py-2 rounded text-white ${
                      task.priority === "Alto"
                        ? "bg-red-500"
                        : task.priority === "Medio"
                        ? "bg-yellow-400"
                        : task.priority === "Baja"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {task.priority || "No asignado"}
                  </span>
                </td>
                <td className="py-6 px-6 text-center">
                  <button
                    onClick={() => openModal(task)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTask && (
        <EditModal
          task={selectedTask}
          onClose={closeModal}
          onSave={updateTask}
        />
      )}
    </div>
  );
};

const EditModal: React.FC<{
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(task.date);
  const [priority, setPriority] = useState(task.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...task, title, description, date, priority });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Titulo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="Baja">Baja</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskList;

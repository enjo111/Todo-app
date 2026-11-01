import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { CheckIcon, PlusIcon, SearchIcon, TrashIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import useTodo from "../hooks/useTodo";
import type Todo from "../models/Todo";

type FilterType = "all" | "active" | "completed";

export const Dashboard = () => {
  const { user } = useAuth();

  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    todos,
    isLoading,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    totalPages,
    totalCount,
    totalActive,
    totalCompleted,
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  } = useTodo();

  const visiblePage = Math.min(currentPage, totalPages);
  useEffect(() => {
    getTodos(visiblePage, limit, searchQuery, filter);
  }, [visiblePage, limit, searchQuery, filter, getTodos]);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    if (isSubmitting) return;
    if (await createTodo(title)) setNewTitle("");
  };

  const handleToggleComplete = async (todo: Todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
  };

  const filteredTodos = todos;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 sm:px-8 py-16 sm:py-24 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Workspace Header */}
        <div className="mb-12 pb-8 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || user?.email?.split("@")[0] || "User"}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              You have <span className="text-indigo-400 font-semibold">{totalActive} pending</span> and{" "}
              <span className="text-emerald-400 font-semibold">{totalCompleted} completed</span> tasks.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
              {totalActive} active
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
              {totalCompleted} done
            </div>
          </div>
        </div>

        {errorMsg && (
          <div role="alert" className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-red-200 ml-2 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Task Creation Bar */}
        <form onSubmit={handleAddTodo} className="mb-10 flex gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              maxLength={256}
              aria-label="New task title"
              placeholder="Add a new task (press Enter)..."
              className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newTitle.trim()}
            className="px-6 py-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{isSubmitting ? "Adding..." : "Add Task"}</span>
          </button>
        </form>

        {/* Task List Panel */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90">
            {/* Search Input */}
            <div className="relative flex-grow max-w-xs">
              <SearchIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-md border border-slate-800 self-start sm:self-auto">
              {(["all", "active", "completed"] as const).map((tab) => {
                const isActive = filter === tab;
                const activeStyle = "bg-indigo-600 text-white";
                const inactiveStyle = "text-slate-400 hover:text-white";
                const count = tab === "all" ? totalCount : tab === "active" ? totalActive : totalCompleted;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setFilter(tab); setCurrentPage(1); }}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      isActive ? activeStyle : inactiveStyle
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2.5 text-xs">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading tasks...</span>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-xs font-medium text-slate-400">No tasks found</p>
              <p className="text-[11px] mt-1 text-slate-400">
                {searchQuery ? "Try clearing your search query." : "Add a task above to start organizing your list."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/60">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="py-3 px-4 flex items-center justify-between gap-3 group hover:bg-slate-800/30 transition-colors"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-grow min-w-0">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      aria-label={`Mark ${todo.title} as ${todo.completed ? "active" : "completed"}`}
                      role="checkbox"
                      aria-checked={todo.completed}
                      onClick={() => handleToggleComplete(todo)}
                      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                        todo.completed
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-700 bg-slate-950 hover:border-slate-600 text-transparent"
                      }`}
                    >
                      <CheckIcon className="w-3 h-3" />
                    </button>
                    <span
                      className={`text-xs truncate transition-all ${
                        todo.completed ? "line-through text-slate-400" : "text-slate-200 font-medium"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    aria-label={`Delete task ${todo.title}`}
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-red-400 p-1 rounded transition-all cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/90">
            <button
              type="button"
              disabled={visiblePage === 1 || isLoading}
              onClick={() => setCurrentPage(Math.max(visiblePage - 1, 1))}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md text-xs font-medium disabled:opacity-50 transition-colors hover:bg-slate-700 disabled:hover:bg-slate-800 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400">
              Page {visiblePage} {totalPages > 1 ? `of ${totalPages}` : ''}
            </span>
            <button
              type="button"
              disabled={(visiblePage >= totalPages) || isLoading}
              onClick={() => setCurrentPage(visiblePage + 1)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md text-xs font-medium disabled:opacity-50 transition-colors hover:bg-slate-700 disabled:hover:bg-slate-800 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

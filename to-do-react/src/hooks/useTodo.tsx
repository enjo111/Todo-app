import { useState, useCallback, useRef } from "react";
import type Todo from "../models/Todo";
import { client } from "../services/api-client";

interface TodosResponse {
  total: number;
  filteredTotal: number;
  totalActive: number;
  totalCompleted: number;
  todos: Todo[];
}

const useTodo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const query = useRef({ page: 1, limit: 10, search: "", filter: "all" });
  const requestId = useRef(0);
  const busy = useRef(false);

  const getTodos = useCallback(async (page: number, limit: number, search = "", filter = "all") => {
    query.current = { page, limit, search, filter };
    const request = ++requestId.current;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), search, filter });
      const data = await client.get<TodosResponse>(`/todos?${params}`);
      if (request !== requestId.current) return;
      setTodos(data.todos);
      setTotalPages(Math.max(1, Math.ceil((data.filteredTotal ?? data.total) / limit)));
      setTotalCount(data.total);
      setTotalActive(data.totalActive);
      setTotalCompleted(data.totalCompleted);
      setErrorMsg(null);
    } catch (error) {
      if (request === requestId.current) setErrorMsg(error instanceof Error ? error.message : "Failed to fetch tasks.");
    } finally {
      if (request === requestId.current) setIsLoading(false);
    }
  }, []);

  const mutate = async (operation: () => Promise<unknown>) => {
    if (busy.current) return false;
    busy.current = true;
    setIsSubmitting(true);
    setErrorMsg(null);
    // Invalidate any fetch that started before this mutation.
    ++requestId.current;
    try {
      await operation();
      const { page, limit, search, filter } = query.current;
      await getTodos(page, limit, search, filter);
      return true;
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Failed to save task.");
      return false;
    } finally {
      busy.current = false;
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const createTodo = (title: string) => mutate(() => client.post<Todo>("/todos", { title }));
  const updateTodo = (id: number, fields: Partial<Todo>) => mutate(() => client.put(`/todos/${id}`, fields));
  const deleteTodo = (id: number) => mutate(() => client.delete(`/todos/${id}`));

  return { isLoading, isSubmitting, todos, errorMsg, setErrorMsg, totalPages,
    totalCount, totalActive, totalCompleted, getTodos, createTodo, updateTodo, deleteTodo };
};
export default useTodo;

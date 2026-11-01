import { Router } from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controller/todoController.js';
import auth_middleware from '../middleware/auth.js';

const router = Router();

router.use(auth_middleware);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
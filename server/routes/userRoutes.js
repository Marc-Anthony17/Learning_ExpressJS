import { Router } from 'express';
const router = Router();
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/userController.js';

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;

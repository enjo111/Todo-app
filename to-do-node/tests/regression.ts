import assert from 'node:assert/strict';
import express from 'express';
import { Sequelize } from 'sequelize';

process.env.JWT_SECRET = 'regression-test-secret';
// Redirect models to an isolated in-memory database before importing routes.
const { sequelize } = await import('../src/config/database.js');
const memory = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
sequelize.define = memory.define.bind(memory);
const { default: users } = await import('../src/routes/userRoutes.js');
const { default: todos } = await import('../src/routes/todoRoutes.js');
await memory.sync();
const app = express();
app.use(express.json());
app.use('/api/auth', users);
app.use('/api/todos', todos);
const server = app.listen(0, '127.0.0.1');
await new Promise<void>(resolve => server.once('listening', resolve));
const address = server.address() as { port: number };
const request = async (path: string, method = 'GET', body?: unknown, token?: string) => {
  const response = await fetch(`http://127.0.0.1:${address.port}/api${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
};
try {
  assert.equal((await request('/todos')).status, 401);
  assert.equal((await request('/auth/login', 'POST', {})).status, 400);
  const registration = await request('/auth/register', 'POST', { name: 'Tester', email: 'tester@example.com', password: 'secret123' });
  assert.equal(registration.status, 201);
  assert.equal(registration.data.user.password, undefined);
  const token = registration.data.token;
  const login = await request('/auth/login', 'POST', { email: 'tester@example.com', password: 'secret123' });
  assert.equal(login.status, 200);
  assert.equal(login.data.user.password, undefined);
  assert.equal((await request('/auth/me', 'GET', undefined, token)).data.user.name, 'Tester');
  const created = await request('/todos', 'POST', { title: '  first task  ' }, token);
  assert.equal(created.status, 201);
  assert.equal(created.data.title, 'first task');
  const id = created.data.id;
  assert.equal((await request(`/todos/${id}`, 'PUT', { title: '' }, token)).status, 400);
  assert.equal((await request(`/todos/${id}`, 'PUT', { title: 42 }, token)).status, 400);
  const updated = await request(`/todos/${id}`, 'PUT', { completed: true, user_id: 999, id: 999 }, token);
  assert.equal(updated.status, 200);
  assert.equal(updated.data.id, id);
  assert.equal(updated.data.user_id, registration.data.user.id);
  for (let i = 0; i < 11; i++) await request('/todos', 'POST', { title: `task ${i}` }, token);
  const page = await request('/todos?page=2&limit=10', 'GET', undefined, token);
  assert.equal(page.data.todos.length, 2);
  assert.equal(page.data.total, 12);
  assert.equal(page.data.totalCompleted, 1);
  const filtered = await request('/todos?filter=completed&search=first', 'GET', undefined, token);
  assert.equal(filtered.data.filteredTotal, 1);
  assert.equal(filtered.data.total, 12);
  assert.equal(filtered.data.todos[0].id, id);
  for (const query of ['page=0', 'limit=-1', 'page=abc', 'limit=1.5', 'filter=invalid']) {
    assert.equal((await request(`/todos?${query}`, 'GET', undefined, token)).status, 400);
  }
  const other = await request('/auth/register', 'POST', { name: 'Other', email: 'other@example.com', password: 'secret123' });
  assert.equal((await request(`/todos/${id}`, 'PUT', { completed: false }, other.data.token)).status, 403);
  assert.equal((await request(`/todos/${id}`, 'DELETE', undefined, other.data.token)).status, 403);
  assert.equal((await request(`/todos/${id}`, 'DELETE', undefined, token)).status, 200);
  console.log('API regression checks passed');
} finally {
  server.close();
  await memory.close();
  await sequelize.close();
}

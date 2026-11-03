process.env.DELETE_TOKEN = 'test-delete-token'

const test = require('node:test')
const assert = require('node:assert/strict')
const app = require('../app')

let server
let baseUrl

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(0, '127.0.0.1', resolve)
  })
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`
})

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
  })
})

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()
  return { response, body }
}

test('creates and retrieves a confession', async () => {
  const created = await request('/confessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'I forgot to await the database query.', category: 'bug' })
  })

  assert.equal(created.response.status, 201)
  assert.equal(created.body.text, 'I forgot to await the database query.')

  const fetched = await request(`/confessions/${created.body.id}`)
  assert.equal(fetched.response.status, 200)
  assert.equal(fetched.body.id, created.body.id)

  const all = await request('/confessions')
  assert.equal(all.response.status, 200)
  assert.equal(all.body.count, 1)
  assert.equal(all.body.data[0].id, created.body.id)
})

test('filters confessions by category', async () => {
  const result = await request('/confessions/category/bug')
  assert.equal(result.response.status, 200)
  assert.equal(result.body.length, 1)

  const invalid = await request('/confessions/category/unknown')
  assert.equal(invalid.response.status, 400)
  assert.deepEqual(invalid.body, { msg: 'invalid category' })
})

test('validates create requests and missing resources', async () => {
  const missingText = await request('/confessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ category: 'bug' })
  })
  assert.equal(missingText.response.status, 400)
  assert.deepEqual(missingText.body, { msg: 'need text' })

  const invalidCategory = await request('/confessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Valid text', category: 'other' })
  })
  assert.equal(invalidCategory.response.status, 400)

  const longText = await request('/confessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'x'.repeat(500), category: 'bug' })
  })
  assert.equal(longText.response.status, 400)

  const missing = await request('/confessions/999999')
  assert.equal(missing.response.status, 404)
})

test('requires the configured delete token', async () => {
  const unauthorized = await request('/confessions/1', { method: 'DELETE' })
  assert.equal(unauthorized.response.status, 403)
  assert.deepEqual(unauthorized.body, { msg: 'no permission' })

  const authorized = await request('/confessions/1', {
    method: 'DELETE',
    headers: { 'x-delete-token': 'test-delete-token' }
  })
  assert.equal(authorized.response.status, 200)
  assert.equal(authorized.body.msg, 'ok')
  assert.equal(authorized.body.item.id, 1)

  const deletedAgain = await request('/confessions/1', {
    method: 'DELETE',
    headers: { 'x-delete-token': 'test-delete-token' }
  })
  assert.equal(deletedAgain.response.status, 404)
})

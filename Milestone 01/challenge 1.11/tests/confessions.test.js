const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { test } = require('node:test')

process.env.DELETE_TOKEN = 'test-delete-token'

const app = require('../app')
const { deleteToken } = require('../config')

test('confessions API preserves its endpoint and response behavior', async t => {
  const server = app.listen(0)
  await new Promise((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
  }))

  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}/api/v1/confessions`
  const request = (url, options) => fetch(`${baseUrl}${url}`, options)
  const postConfession = confessionData => request('', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(confessionData)
  })

  await t.test('loads the delete token from environment configuration', () => {
    assert.equal(deleteToken, 'test-delete-token')
  })

  await t.test('denies deletion when no token is configured', () => {
    const script = `
      const controller = require('./controllers/confessionController')
      const response = {
        status(statusCode) { this.statusCode = statusCode; return this },
        json(body) { process.stdout.write(JSON.stringify({ status: this.statusCode, body })) }
      }
      controller.deleteConfession({ headers: {}, params: { id: '1' } }, response)
    `
    const result = spawnSync(process.execPath, ['-e', script], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DELETE_TOKEN: '' }
    })
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), {
      status: 403,
      body: { msg: 'no permission' }
    })
  })

  await t.test('rejects a missing body and missing text', async () => {
    const missingBodyResponse = await request('', { method: 'POST' })
    assert.equal(missingBodyResponse.status, 400)
    assert.deepEqual(await missingBodyResponse.json(), { msg: 'need text' })

    const missingTextResponse = await postConfession({ category: 'bug' })
    assert.equal(missingTextResponse.status, 400)
    assert.deepEqual(await missingTextResponse.json(), { msg: 'need text' })
  })

  await t.test('rejects non-string text and text at the 500 character limit', async () => {
    const nonStringResponse = await postConfession({ text: 42, category: 'bug' })
    assert.equal(nonStringResponse.status, 400)
    assert.deepEqual(await nonStringResponse.json(), { msg: 'need text' })

    const oversizedResponse = await postConfession({ text: 'x'.repeat(500), category: 'bug' })
    assert.equal(oversizedResponse.status, 400)
    assert.deepEqual(await oversizedResponse.json(), {
      error: 'text too big, must be less than 500 characters long buddy'
    })
  })

  await t.test('rejects an unsupported category with its original response format', async () => {
    const response = await postConfession({ text: 'A test confession', category: 'other' })
    assert.equal(response.status, 400)
    assert.equal(await response.text(), 'category not in stuff')
  })

  let createdConfession
  await t.test('creates a confession and returns its original response shape', async () => {
    const response = await postConfession({ text: 'A test confession', category: 'bug' })
    assert.equal(response.status, 201)
    createdConfession = await response.json()
    assert.equal(createdConfession.id, 1)
    assert.equal(createdConfession.text, 'A test confession')
    assert.equal(createdConfession.category, 'bug')
    assert.ok(Number.isFinite(Date.parse(createdConfession.created_at)))
  })

  await t.test('gets one confession and returns 404 for an unknown id', async () => {
    const response = await request(`/${createdConfession.id}`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), createdConfession)

    const missingResponse = await request('/999')
    assert.equal(missingResponse.status, 404)
    assert.deepEqual(await missingResponse.json(), { msg: 'not found' })
  })

  await t.test('lists confessions with data and count', async () => {
    const response = await request('')
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      data: [createdConfession],
      count: 1
    })
  })

  await t.test('filters by category and rejects an invalid category', async () => {
    const categoryResponse = await request('/category/bug')
    assert.equal(categoryResponse.status, 200)
    assert.deepEqual(await categoryResponse.json(), [createdConfession])

    const invalidCategoryResponse = await request('/category/other')
    assert.equal(invalidCategoryResponse.status, 400)
    assert.deepEqual(await invalidCategoryResponse.json(), { msg: 'invalid category' })
  })

  await t.test('requires the configured token and deletes the selected confession', async () => {
    const unauthorizedResponse = await request(`/${createdConfession.id}`, { method: 'DELETE' })
    assert.equal(unauthorizedResponse.status, 403)
    assert.deepEqual(await unauthorizedResponse.json(), { msg: 'no permission' })

    const wrongTokenResponse = await request(`/${createdConfession.id}`, {
      method: 'DELETE',
      headers: { 'x-delete-token': 'wrong-token' }
    })
    assert.equal(wrongTokenResponse.status, 403)
    assert.deepEqual(await wrongTokenResponse.json(), { msg: 'no permission' })

    const deleteResponse = await request(`/${createdConfession.id}`, {
      method: 'DELETE',
      headers: { 'x-delete-token': deleteToken }
    })
    assert.equal(deleteResponse.status, 200)
    assert.deepEqual(await deleteResponse.json(), { msg: 'ok', item: createdConfession })
  })

  await t.test('returns 404 after deletion and for deleting an unknown id', async () => {
    const deletedResponse = await request(`/${createdConfession.id}`)
    assert.equal(deletedResponse.status, 404)

    const missingDeleteResponse = await request('/999', {
      method: 'DELETE',
      headers: { 'x-delete-token': deleteToken }
    })
    assert.equal(missingDeleteResponse.status, 404)
    assert.deepEqual(await missingDeleteResponse.json(), { msg: 'not found buddy' })
  })
})

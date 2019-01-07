import axios from 'axios'
import crypto from 'crypto'

const createContentDigest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`)

exports.sourceNodes = async ({
  actions,
  createNodeId
}, {
  projectName,
}) => {

  const { createNode } = actions
  const client = axios.create({
    baseURL: 'https://scrapbox.io/api',
  })

  const { data } = await client.request({
    method: 'get',
    url: `/pages/${projectName}`,
  })

  data.pages.forEach(page => {
    const contentDigest = createContentDigest(page)
    const nodeId = createNodeId(`ScrapboxPage${page.id}`)

    createNode({
      ...page,
      id: nodeId,
      children: [],
      parent: null,
      internal: {
        type: 'ScrapboxPage',
        contentDigest,
      }
    })
  })

  return
}
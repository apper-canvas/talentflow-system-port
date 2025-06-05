import documentData from '../mockData/document.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let documents = [...documentData]

const documentService = {
  async getAll() {
    await delay(300)
    return [...documents]
  },

  async getById(id) {
    await delay(200)
    const document = documents.find(doc => doc.id === id)
    return document ? {...document} : null
  },

  async create(documentData) {
    await delay(450)
    const newDocument = {
      ...documentData,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    }
    documents.push(newDocument)
    return {...newDocument}
  },

  async update(id, documentData) {
    await delay(350)
    const index = documents.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents[index] = { ...documents[index], ...documentData }
      return {...documents[index]}
    }
    throw new Error('Document not found')
  },

  async delete(id) {
    await delay(250)
    const index = documents.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents.splice(index, 1)
      return true
    }
    throw new Error('Document not found')
  }
}

export default documentService
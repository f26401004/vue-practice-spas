import Worker from '@/firebase/firebase.worker.js'

export class FireWorker {
  constructor () {
    console.log('test678')
    this.worker = new Worker()
    this.worker.addEventListener('message', event => {
      let data = event.data.response.data
      if (event.data.response.type === 'QuerySnapshot') {
        data.docs = data.docs.map(d => {
          const _data = d.data
          d.data = () => _data
          return d
        })
      }
      this.listeners[event.data.name](data)
    })
  }

  initializeApp (opts) {
    this.worker.postMessage({ cmd: 'initializeApp', data: opts })
    return new FireWorkerApp(this)
  }

  postMessage (message) {
    this.worker.postMessage(message)
  }

  registerListener (namespace, callback) {
    this.listeners[namespace] = callback
  }
}

export class FireWorkerApp {
  constructor (worker) {
    this.worker = worker
  }
  firestore () {
    return new FireWorkerFirestore(this.worker)
  }
}

export class FireWorkerFirestore {
  constructor (worker) {
    this.worker = worker
  }
  collection (path) {
    return new FireWorkerFirestoreCol(this.worker, path)
  }
}

export class FireWorkerFirestoreCol {
  constructor (worker, path) {
    this.worker = worker
    this.namespace = `firestore.col`
    this.snapshotNamespace = `${this.namespace}.onSnapshot`
    this.pathNamespace = `${this.namespace}.${path}`
  }
  onSnapshot (next) {
    this.worker.postMessage({
      cmd: this.snapshotNamespace,
      data: { path: this.path }
    })
    this.worker.registerListener(`${this.pathNamespace}.onSnapshot`, next)
  }
  set (data) {
    this.worker.postMessage({
      cmd: `${this.namespace}.add`,
      data: { path: this.path, data }
    })
  }
}

export const firebase = new FireWorker()

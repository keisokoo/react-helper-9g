import { openDB } from 'idb'

// ? indexedDb configs
export interface DATABASE_CONFIGS {
  database_name: string
  database_version: number
  store_name: string
}
export const databaseConfigs: DATABASE_CONFIGS = {
  database_name: 'koo-db',
  store_name: 'koo-store',
  database_version: 1,
}
const { database_name, database_version, store_name } = databaseConfigs

const databaseTarget = (config?: DATABASE_CONFIGS) => {
  if (config) {
    return config
  } else {
    return { database_name, database_version, store_name }
  }
}
export const initializeDatabase = async (config?: DATABASE_CONFIGS) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  await openDB(database_name, database_version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(store_name)) {
        const store = db.createObjectStore(store_name, {
          autoIncrement: true,
          keyPath: 'key',
        })
        store.createIndex('ino', 'ino', { unique: true })
        store.createIndex('row_index', 'row_index', { unique: true })
      }
    },
  })
  await checkAndReturnExistStore(config)
}
export const checkAndReturnExistStore = async (config?: DATABASE_CONFIGS) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  try {
    return db.transaction(store_name).objectStore(store_name)
  } catch (error) {
    const store = db.createObjectStore(store_name, {
      autoIncrement: true,
      keyPath: 'key',
    })
    store.createIndex('ino', 'ino', { unique: true })
    store.createIndex('row_index', 'row_index', { unique: true })
    return store
  }
}
export const getCountFromDatabase = async (config?: DATABASE_CONFIGS) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const count = await db.transaction(store_name).objectStore(store_name).count()
  return count
}

export const getCurrentData = async (
  keyId: string,
  config?: DATABASE_CONFIGS
) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const transaction = db.transaction(store_name, 'readonly')
  const getData = await db.getFromIndex(store_name, 'ino', Number(keyId))
  const count = await db.count(store_name)
  if (!getData) return null
  const nextIndex = getData.row_index + 1 >= count ? 0 : getData.row_index + 1
  const prevIndex =
    getData.row_index - 1 < 0 ? count - 1 : getData.row_index - 1
  const nextData = await db.getFromIndex(store_name, 'row_index', nextIndex)
  const prevData = await db.getFromIndex(store_name, 'row_index', prevIndex)

  await transaction.done
  return {
    prev: prevData,
    current: getData,
    next: nextData,
  }
}
export const putDataToDatabase = async <T extends object & { id: number }>(
  currentItem: T,
  updateObject: Partial<T>,
  config?: DATABASE_CONFIGS
) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const transaction = db.transaction(store_name, 'readwrite')
  const store = transaction.objectStore(store_name)
  const getData = (await store.get(currentItem.id)) as T
  const updateData: T = { ...getData, ...updateObject }
  await store.put(updateData)
  transaction.commit()
  await transaction.done
}

export const deleteDataOnDatabase = async (
  id: number,
  config?: DATABASE_CONFIGS
) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const transaction = db.transaction(store_name, 'readwrite')
  await transaction.objectStore(store_name).delete(id)
  transaction.commit()
  await transaction.done
}

export const addDataToDataBase = async <T>(
  addNewObject: T,
  config?: DATABASE_CONFIGS
) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const transaction = db.transaction(store_name, 'readwrite')
  await transaction.objectStore(store_name).add(addNewObject)
  transaction.commit()
  await transaction.done
}
export const getDbSources = async (config?: DATABASE_CONFIGS) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const storeData = await db
    .transaction(store_name, 'readonly')
    .objectStore(store_name)
    .getAll()
  return storeData
}
export const clearStorage = async (config?: DATABASE_CONFIGS) => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  const db = await openDB(database_name, database_version)
  const transaction = db.transaction(store_name, 'readwrite')
  await transaction.objectStore(store_name).clear()
  transaction.commit()
  await transaction.done
}

export const getByPagination = (
  offset: number,
  limit: number,
  config?: DATABASE_CONFIGS
): Promise<any> => {
  const { database_name, database_version, store_name } = databaseTarget(config)
  return new Promise(async (resolve, reject) => {
    const db = await openDB(database_name, database_version)
    const results: any = []
    const transaction = db.transaction(store_name)
    transaction.oncomplete = () => {
      return resolve(results)
    }
    transaction.onerror = (event) => {
      reject([])
    }
    const store = transaction.objectStore(store_name)

    // const index = store.index('id')
    // let cursor = await store.openCursor(null, 'prev')
    let cursor = await store.openCursor()

    let advanced = offset === 0
    let counter = offset

    while (cursor) {
      if (!cursor) {
        return
      }
      if (!advanced) {
        advanced = true
        cursor = await cursor.advance(offset)
      }
      counter++
      if (cursor) {
        results.push({ ...cursor.value })
      }
      if (counter >= limit) {
        return
      }
      if (cursor) {
        cursor = await cursor.continue()
      }
    }
  })
}

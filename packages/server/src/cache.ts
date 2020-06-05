import { FabCache, FabCacheValue } from '@fab/core'
import NodeCache from 'node-cache'

export class Cache implements FabCache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  async set(key: string, value: FabCacheValue, ttl_seconds?: number) {
    // if (value.hasOwnProperty(Symbol.asyncIterator)) {
    // todo: read the stream to completion then store it
    // }
    this.cache.set(key, value, ttl_seconds || 0 /* unlimited */)
  }

  async setJSON(key: string, value: any, ttl_seconds?: number) {
    await this.set(key, JSON.stringify(value), ttl_seconds)
  }

  async get(key: string) {
    return this.cache.get<string>(key)
  }

  async getJSON(key: string) {
    const val = await this.get(key)
    return val && JSON.parse(val)
  }

  async getArrayBuffer(key: string) {
    return this.cache.get<ArrayBuffer>(key)
  }

  async getNumber(key: string) {
    return this.cache.get<number>(key)
  }

  async getStream(key: string) {
    // todo: create a new stream from the stored object to stream it out
    return this.cache.get<ReadableStream>(key)
  }
}
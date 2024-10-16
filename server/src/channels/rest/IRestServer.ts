export interface IRestServer {
  start(): Promise<void>
  stop(): Promise<void>
}

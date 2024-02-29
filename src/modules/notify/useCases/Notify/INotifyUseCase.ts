interface INotifyUseCase {
  execute(id: string, message: string): Promise<void>;
  execute(ids: string[], message: string): Promise<void>;
}
export { INotifyUseCase };

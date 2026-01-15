export interface IQuery<TResult> {}

export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
  execute(query: TQuery): Promise<TResult>;
}

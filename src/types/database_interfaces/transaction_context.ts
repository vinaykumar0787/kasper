export interface ITransactionContext {
  connection: unknown;
  rollback: boolean;

  markForRollback(): void;
}

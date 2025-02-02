import { ConfirmOptions, PublicKey, SystemProgram } from '@safecoin/web3.js';
import type { Metaplex } from '@/Metaplex';
import {
  assertSol,
  Operation,
  OperationHandler,
  Signer,
  SolAmount,
  useOperation,
} from '@/types';
import { DisposableScope, TransactionBuilder } from '@/utils';
import { SendAndConfirmTransactionResponse } from '../../rpcModule';

// -----------------
// Operation
// -----------------

const Key = 'TransferSolOperation' as const;

/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * await metaplex
 *   .system()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   })
 *   .run();
 * ````
 *
 * @group Operations
 * @category Constructors
 */
export const transferSolOperation = useOperation<TransferSolOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type TransferSolOperation = Operation<
  typeof Key,
  TransferSolInput,
  TransferSolOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type TransferSolInput = {
  /**
   * The account that sends the SOLs as a Signer.
   *
   * @defaultValue `metaplex.identity()`
   */
  from?: Signer;

  /** The address of the account that receives the SOLs. */
  to: PublicKey;

  /** The amount of SOLs to send. */
  amount: SolAmount;

  /**
   * Base public key to use to derive the funding account address.
   *
   * @defaultValue Defaults to not being used.
   */
  basePubkey?: PublicKey;

  /**
   * Seed to use to derive the funding account address.
   *
   * @defaultValue Defaults to not being used.
   */
  seed?: string;

  /** The address of the SPL System program to override if necessary. */
  program?: PublicKey;

  /** A set of options to configure how the transaction is sent and confirmed. */
  confirmOptions?: ConfirmOptions;
};

/**
 * @group Operations
 * @category Outputs
 */
export type TransferSolOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const transferSolOperationHandler: OperationHandler<TransferSolOperation> =
  {
    async handle(
      operation: TransferSolOperation,
      metaplex: Metaplex,
      scope: DisposableScope
    ): Promise<TransferSolOutput> {
      const builder = transferSolBuilder(metaplex, operation.input);
      return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
    },
  };

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type TransferSolBuilderParams = Omit<
  TransferSolInput,
  'confirmOptions'
> & {
  /** A key to distinguish the instruction that transfers some SOL. */
  instructionKey?: string;
};

/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .system()
 *   .builders()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   });
 * ````
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const transferSolBuilder = (
  metaplex: Metaplex,
  params: TransferSolBuilderParams
): TransactionBuilder => {
  const {
    from = metaplex.identity(),
    to,
    amount,
    basePubkey,
    seed,
    program = SystemProgram.programId,
  } = params;

  assertSol(amount);

  return TransactionBuilder.make().add({
    instruction: SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount.basisPoints.toNumber(),
      ...(basePubkey ? { basePubkey, seed } : {}),
      programId: program,
    }),
    signers: [from],
    key: params.instructionKey ?? 'transferSol',
  });
};

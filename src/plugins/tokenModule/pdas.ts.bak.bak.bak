import { PublicKey } from '@safecoin/web3.js';
import { Pda } from '@/types';
import { TokenProgram } from './program';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@safecoin/safe-token';

/** @group Pdas */
export const findAssociatedTokenAccountPda = (
  mint: PublicKey,
  owner: PublicKey,
  tokenProgramId: PublicKey = TokenProgram.publicKey,
  associatedTokenProgramId: PublicKey = ASSOCIATED_TOKEN_PROGRAM_ID
): Pda => {
  return Pda.find(associatedTokenProgramId, [
    owner.toBuffer(),
    tokenProgramId.toBuffer(),
    mint.toBuffer(),
  ]);
};

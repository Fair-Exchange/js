import { PublicKey, PublicKeyInitData } from '@safecoin/web3.js';

export type PublicKeyString = string;
export type PublicKeyValues =
  | PublicKeyInitData
  | { publicKey: PublicKey }
  | { address: PublicKey };

export const toPublicKey = (value: PublicKeyValues): PublicKey => {
  if (typeof value === 'object' && 'publicKey' in value) {
    return value.publicKey;
  }

  if (typeof value === 'object' && 'address' in value) {
  // @ts-ignore
    return value.address;
  }

  return new PublicKey(value);
};

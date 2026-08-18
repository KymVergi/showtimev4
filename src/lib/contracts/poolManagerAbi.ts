/**
 * Uniswap V4 PoolManager — minimal, canonical fragments.
 *
 * These are taken from the published `IPoolManager` interface (v4-core) and are
 * protocol-level, not SHOWTIME-specific. They are used only to read pool state
 * and to decode `Swap` logs. No SHOWTIME behaviour is implied by anything here.
 *
 * If your deployment targets a PoolManager whose interface differs, replace
 * this file with the verified ABI for NEXT_PUBLIC_POOL_MANAGER_ADDRESS.
 */

import type { Abi } from "viem";

export const POOL_MANAGER_ABI_IS_CANONICAL_INTERFACE = true;

export const poolManagerAbi = [
  {
    type: "event",
    name: "Swap",
    anonymous: false,
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "sender", type: "address", indexed: true },
      { name: "amount0", type: "int128", indexed: false },
      { name: "amount1", type: "int128", indexed: false },
      { name: "sqrtPriceX96", type: "uint160", indexed: false },
      { name: "liquidity", type: "uint128", indexed: false },
      { name: "tick", type: "int24", indexed: false },
      { name: "fee", type: "uint24", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ModifyLiquidity",
    anonymous: false,
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "sender", type: "address", indexed: true },
      { name: "tickLower", type: "int24", indexed: false },
      { name: "tickUpper", type: "int24", indexed: false },
      { name: "liquidityDelta", type: "int256", indexed: false },
      { name: "salt", type: "bytes32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Initialize",
    anonymous: false,
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "currency0", type: "address", indexed: true },
      { name: "currency1", type: "address", indexed: true },
      { name: "fee", type: "uint24", indexed: false },
      { name: "tickSpacing", type: "int24", indexed: false },
      { name: "hooks", type: "address", indexed: false },
      { name: "sqrtPriceX96", type: "uint160", indexed: false },
      { name: "tick", type: "int24", indexed: false },
    ],
  },
  {
    type: "function",
    name: "extsload",
    stateMutability: "view",
    inputs: [{ name: "slot", type: "bytes32" }],
    outputs: [{ name: "", type: "bytes32" }],
  },
] as const satisfies Abi;

export default poolManagerAbi;

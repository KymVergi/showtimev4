/**
 * $SHOWTIME token ABI.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE CONTAINS
 * ─────────────────────────────────────────────────────────────────────────────
 * The **standard ERC-20 interface** only: the functions and events that every
 * ERC-20 is required to expose by EIP-20. Nothing here is a claim about the
 * SHOWTIME deployment beyond "it is an ERC-20".
 *
 * It deliberately does NOT contain any project-specific functions (taxes,
 * reflections, buyback triggers, owner controls, …). Those are only real if
 * they appear in the deployed artifact.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INSTALL THE REAL ABI
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Fetch the verified ABI from Etherscan for NEXT_PUBLIC_TOKEN_ADDRESS.
 * 2. Replace `deployedTokenAbi` below with that array.
 * 3. Set `TOKEN_ABI_IS_DEPLOYED_ARTIFACT` to `true`.
 *
 * Until step 3 happens the UI labels token-contract introspection as
 * "STANDARD INTERFACE ONLY" so nobody mistakes the placeholder for the
 * deployed behaviour.
 */

import type { Abi } from "viem";

/**
 * Set to `true` only once `deployedTokenAbi` has been replaced with the ABI
 * pulled from the verified contract.
 */
export const TOKEN_ABI_IS_DEPLOYED_ARTIFACT = false;

/** EIP-20 standard interface — safe, universal, non-speculative. */
export const erc20Abi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const satisfies Abi;

/**
 * The ABI actually used by the app. Replace with the verified deployment
 * artifact — see the header of this file.
 */
export const deployedTokenAbi: Abi = erc20Abi;

export const tokenAbi = deployedTokenAbi;

/** True when the app has an ABI it can call at all. */
export const TOKEN_ABI_CONFIGURED = deployedTokenAbi.length > 0;

export default tokenAbi;

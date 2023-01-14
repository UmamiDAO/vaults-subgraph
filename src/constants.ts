import { Address } from "@graphprotocol/graph-ts";

export const AGGREGATE_VAULT_ADDRESS = Address.fromString(
  "0xF759C9CFFB7D96615cDE95B4FFa4700fa907BBeb"
);
export const USDC_VAULT_ADDRESS = Address.fromString(
  "0x676A46b081285D5da47A09e85176B84750D8eA6A"
);
export const WETH_VAULT_ADDRESS = Address.fromString(
  "0x9D9801e4215f08297A5b1Ee3C6ea4d551f13ABe6"
);
export const WBTC_VAULT_ADDRESS = Address.fromString(
  "0x79203B6275f71F88a2E9749134Fab933E44F940D"
);
export const LINK_VAULT_ADDRESS = Address.fromString(
  "0x5665DCc51Bd01f789C26517CB944292d9f0e4d56"
);
export const UNI_VAULT_ADDRESS = Address.fromString(
  "0x204C6Cf53A39e0C77A135318c5D0F11D33090F39"
);
export const VAULTS_ARRAY = [
  USDC_VAULT_ADDRESS,
  WETH_VAULT_ADDRESS,
  WBTC_VAULT_ADDRESS,
  LINK_VAULT_ADDRESS,
  UNI_VAULT_ADDRESS,
];

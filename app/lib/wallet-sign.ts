import { type ConnectedWallet } from '@privy-io/react-auth';

interface EIP1193Provider {
  request: (req: { method: string; params?: unknown[] }) => Promise<unknown>;
}

interface EIP1193ProviderWithMeta {
  request: (req: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
}

function getWindowEthereum(): EIP1193Provider | undefined {
  if (typeof window === 'undefined') return undefined;
  const ethereum = (window as unknown as { ethereum?: EIP1193ProviderWithMeta & { providers?: EIP1193ProviderWithMeta[] } }).ethereum;
  if (!ethereum) return undefined;
  if (ethereum.providers && ethereum.providers.length > 0) {
    return ethereum.providers.find((p) => p.isMetaMask) || ethereum.providers[0];
  }
  return ethereum;
}

/**
 * Sign a message with the user's wallet, trying the best available path:
 * 1. A connected Privy/external wallet (ConnectedWallet.sign)
 * 2. The browser's injected wallet (e.g. MetaMask / window.ethereum)
 * 3. Privy's embedded wallet signer (fallback)
 */
export async function signWithWallet(
  message: string,
  walletAddress: string,
  wallets: ConnectedWallet[],
  privySignMessage: (message: string) => Promise<string>,
): Promise<string> {
  const external = wallets.find(
    (w) => w.address.toLowerCase() === walletAddress.toLowerCase(),
  );
  if (external) {
    return external.sign(message);
  }

  const eth = getWindowEthereum();
  if (eth) {
    const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
    const selected = accounts[0];
    if (!selected || selected.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Active wallet does not match the connected address');
    }
    return (await eth.request({
      method: 'personal_sign',
      params: [message, selected],
    })) as string;
  }

  return privySignMessage(message);
}

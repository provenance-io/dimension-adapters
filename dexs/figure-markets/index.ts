import fetchURL from "../../utils/fetchURL";
import { SimpleAdapter, FetchOptions } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";

const tokenMapping = {
  "ETH-USD": { coingeckoId: "ethereum", decimals: 0 },
  "ETH-USDC": { coingeckoId: "ethereum", decimals: 0 },
  "BTC-USD": { coingeckoId: "bitcoin", decimals: 0 },
  "BTC-USDC": { coingeckoId: "bitcoin", decimals: 0 },
  "USDT-USD": { coingeckoId: "tether", decimals: 0 },
  "USDC-USD": { coingeckoId: "usd-coin", decimals: 0 },
  "SOL-USD": { coingeckoId: "solana", decimals: 0 },
  "SOL-USDC": { coingeckoId: "solana", decimals: 0 },
  "XRP-USD": { coingeckoId: "ripple", decimals: 0 },
  "XRP-USDC": { coingeckoId: "ripple", decimals: 0 },
  "LINK-USD": { coingeckoId: "chainlink", decimals: 0 },
  "LINK-USDC": { coingeckoId: "chainlink", decimals: 0 },
  "UNI-USD": { coingeckoId: "uniswap", decimals: 0 },
  "UNI-USDC": { coingeckoId: "uniswap", decimals: 0 },
  "HASH-USD": { coingeckoId: "hash-2", decimals: 0 },
  "HASH-USDT": { coingeckoId: "hash-2", decimals: 0 },
  "HASH-USDC": { coingeckoId: "hash-2", decimals: 0 },
};

const fetch = async ({ createBalances }: FetchOptions) => {
  const dailyVolume = createBalances();
  await Promise.all(
    Object.keys(tokenMapping).map(async (tradingPair) => {
      const { baseVolume24h } = await fetchURL(
        `https://www.figuremarkets.com/service-hft-exchange/api/v1/markets/${tradingPair}`
      );
      dailyVolume.addCGToken(
        tokenMapping[tradingPair].coingeckoId,
        parseFloat(baseVolume24h)
      );
    })
  );
  return { dailyVolume };
};

const adapter: SimpleAdapter = {
  version: 2,
  chains: [CHAIN.PROVENANCE],
  adapter: {
    [CHAIN.PROVENANCE]: {
      fetch,
      runAtCurrTime: true,
    },
  },
  methodology:
    "Total token volume across all supported pairs on Figure Markets",
};

export default adapter;

// npm test dexs figure-markets

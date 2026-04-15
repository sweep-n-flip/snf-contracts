# SNF AMM — Deployment Runbook

Instruções práticas para **deployar uma nova chain** (contratos Solidity) e **deployar/atualizar um subgraph**.

Para o estado atual de cada chain (endereços live, URLs, status), ver [README.md](README.md).

---

## Parte 1 — Deployar contratos em uma nova chain

### Pré-requisitos

| Item | Onde |
|---|---|
| Entrada do DEX upstream da chain | [scripts/delegate-configs.ts](scripts/delegate-configs.ts) — `DELEGATE_CONFIGS[<chainId>]` |
| ADMIN/FUNDING/DELEGATE_ROUTER da chain | [scripts/deploy.ts](scripts/deploy.ts) — `NETWORK_CONFIG[<chainId>]` |
| Nome + RPC URL da chain | [hardhat.config.ts](hardhat.config.ts) — `NETWORK_CONFIG[<nome>]` |
| Private key do deployer | `keystore.json` (gitignored) |
| Etherscan API key (V2 unifica todas as chains) | `etherscan.json` (gitignored) — qualquer campo basta |
| Alchemy API key + nome da network | `.env` (gitignored) — `ALCHEMY_KEY=...` e `NETWORK=...` |

`.env.sample` na raiz é carregado automaticamente por `dotenv` em `hardhat.config.ts`. Copie para `.env` e preencha.

### Passos

```powershell
# 1. Prepara Solidity para a chain (reescreve Delegation.sol + UniswapV2Library.sol)
npx hardhat run scripts/prepare.ts --network livenet

# 2. (opcional) Validar em fork local — gratuito, sem tocar mainnet
#    Notar: alguns L2/sidechains (Polygon) têm problema com hardfork history em fork.
npx hardhat run scripts/deploy.ts --network hardhat

# 3. Deploy real
npx hardhat run scripts/deploy.ts --network livenet
# → endereços (FACTORY/ROUTER/WRAPPER/PAIR) salvos automaticamente em deployments/<chainId>.json
# → script é idempotente: re-rodar pula o que já está deployado

# 4. Verify nos explorers
npx hardhat run scripts/verify.ts --network livenet
```

### O que cada script faz

- **`prepare.ts`** — para o `chainId` ativo (vem de `dataSource.network()`/hardhat config), reescreve `contracts/core/Delegation.sol` com as constantes do DEX upstream (factory, initCodeHash, netFee, flags zksync/velodrome) e atualiza o `initCodeHash` hardcoded em `contracts/periphery/libraries/UniswapV2Library.sol` após compilar uma vez. Re-roda compile.
- **`deploy.ts`** — sanity checks (Delegation matches, library hash matches), deploy de Factory + Router (`UniswapV2Router01Collection`), `setRouter` + `setRouterSetter`, deploy de wrapper de teste (BLOCKIES) e pair de teste (WETH/WRAPPER). Persiste cada endereço em `deployments/<chainId>.json` após sucesso.
- **`verify.ts`** — submete bytecode + constructor args ao Etherscan (V2 unificada).

### Padrão de variáveis no `.env`

```env
NETWORK=mainnet
ALCHEMY_KEY=sua_alchemy_key

# Override (opcional) — útil pra resume manual ou verify
FACTORY=0x...
ROUTER=0x...
WRAPPER=0x...
PAIR=0x...
FACTORY_FROM=0x...   # se a deployer atual ≠ a que deployou o Factory
```

Para trocar de chain, edite `NETWORK=...` no `.env`. Sem precisar exportar `$env:` por sessão.

### Adicionar uma chain nova ao `delegate-configs.ts`

Para cada chain, definir o DEX upstream que vamos delegar pares ERC20↔ERC20. Exemplo:

```ts
// scripts/delegate-configs.ts
[<chainId>]: {
  dexName:        'SushiSwap (X mainnet)',
  factory:        '0x...',
  initCodeHash:   '0x...',
  netFee:         9970,    // 0.30% para SushiSwap/Uniswap V2; 9975 para PancakeSwap; etc.
  createZksync:   false,
  velodrome:      false,
}
```

**Como descobrir os valores:**

- **factory** — chame `router.factory()` no router upstream (ex: SushiRouter).
- **initCodeHash** — `factory.pairCodeHash()` ou `factory.INIT_CODE_PAIR_HASH()` no factory upstream.
- **netFee** — específico do DEX. SushiSwap/Uniswap V2 = 9970. PancakeSwap = 9975. Velodrome stable = 9998. Mode = 9997.

### Sanity checks que protegem você

`deploy.ts` aborta antes do primeiro `tx` se:

1. **Delegation factory mismatch** — `Delegation.sol` precisa conter o address retornado por `delegateRouter.factory()`. Comparação **case-insensitive** (não depende de checksum EIP-55).
2. **Delegation initCodeHash mismatch** — idem para o hash retornado por `factory.pairCodeHash()`.
3. **Library initCodeHash mismatch** — após o Factory ser deployado, `factory._initCodeHash()` precisa bater com o hash hardcoded em `UniswapV2Library.sol`. Se diverge, o Router calcula endereços de pair errados → todo swap quebra.

`prepare.ts` automatiza os 3 — se você sempre rodar prepare antes de deploy, esses checks passam.

### Custos típicos por deploy (~13M gas total)

| Chain | Gas atual típico | Custo total |
|---|---|---|
| Ethereum | 0.15 gwei (madrugada) → 30 gwei (peak) | 0.002 ETH → 0.4 ETH |
| Polygon | 30-150 gwei | 0.4 → 2 MATIC (~$0.30) |
| Arbitrum | 0.02 gwei | ~0.0003 ETH |
| Base | 0.01 gwei | ~0.0001 ETH |

Sempre cheque [etherscan.io/gastracker](https://etherscan.io/gastracker) (ou o tracker da chain) antes de deployar mainnet.

---

## Parte 2 — Deployar/atualizar um subgraph

Subgraphs são deployados no **Goldsky**. The Graph Studio é evitado (Hosted Service decommissionado em 2024).

### Pré-requisitos

| Item | Onde |
|---|---|
| API key do Goldsky | `.env` na raiz — `GOLDSKY_API_KEY=...` (obtém em [app.goldsky.com](https://app.goldsky.com) → Settings → API Keys) |
| Config da chain alvo | `subgraph/config/<chain>.json` — `factoryAddress`, `factoryStartBlock`, `goldskySlug` opcional |
| Script `set:<chain>` em `subgraph/package.json` | Já existe pra todas as chains conhecidas |
| Script `deploy:goldsky:<chain>` em `subgraph/package.json` | Existe pras chains com slug não-padrão; senão usa o default `deploy:goldsky` |

### Passos — chain nova (contratos novos)

```powershell
# 1. Login Goldsky (uma vez por máquina ou ao trocar de conta)
cd subgraph
pnpm goldsky:login

# 2. Para chain nova, criar:
#    - subgraph/config/<chain>.json com factoryAddress + factoryStartBlock + goldskySlug
#    - script set:<chain> em subgraph/package.json (mustache → subgraph.yaml)
#    - script deploy:goldsky:<chain> com slug certo (ex: snf-<chain>/1.0.0)

# 3. Build + deploy
pnpm set:<chain>      # gera subgraph.yaml a partir do config
pnpm codegen          # gera types TS
pnpm build            # compila WASM
pnpm deploy:goldsky:<chain>
# → URL: https://api.goldsky.com/api/public/<project>/subgraphs/<slug>/<version>/gn
```

### Passos — atualizar subgraph existente (mesma versão)

Goldsky **não sobrescreve** versões. Para atualizar mantendo o mesmo slug+versão:

```powershell
cd subgraph
npx goldsky subgraph delete <slug>/<version> --force
pnpm set:<chain>
pnpm codegen
pnpm build
pnpm deploy:goldsky:<chain>
```

`--force` evita o prompt interativo (necessário em PowerShell — sem TTY).

### Importar subgraph existente (clonar sem ter o source)

```powershell
npx goldsky subgraph deploy <slug>/<version> --from-url <studio-url>
```

Cria um clone idêntico (schema + mappings) do subgraph remoto. Útil pra migrar do The Graph Studio mantendo o schema antigo intacto. Para redeployar com **nosso schema v2** apontando pro mesmo factory antigo, é melhor criar um config local e usar o flow normal de build + deploy.

### Como descobrir `factoryStartBlock`

Binary search em `eth_getCode` via Alchemy (ou outro RPC):

```javascript
// Pseudo
let lo = 0, hi = await rpc.eth_blockNumber();
while (hi - lo > 1) {
  const mid = (lo + hi) >> 1;
  const code = await rpc.eth_getCode(factoryAddress, mid);
  if (code !== '0x') hi = mid; else lo = mid;
}
// hi = bloco de criação
```

Roda em ~25 chamadas RPC. Use o bloco encontrado como `factoryStartBlock` (ou subtraia ~10 blocos pra margem).

### Múltiplas contas Goldsky (limite de slots no plano free)

Free tier do Goldsky = 3 subgraphs por projeto. Distribuição atual:

- **Account 1 (`snf`)**: subgraphs latest da Base, Mainnet, Arbitrum (atual) — ver `snf-arbitrum-old` aqui também (legado).
- **Account 2 (`snf-2`)**: subgraphs `-old` legados (Polygon, Mainnet, Base).
- **Account 3 (`snf-3`)**: subgraphs latest novos da Polygon e Arbitrum.

Para trocar de conta no CLI:

```powershell
# Atualiza .env com a key da conta alvo
# Depois:
cd subgraph
pnpm goldsky:login
```

### Slug overrides (chains com slug não-padrão)

Por padrão `deploy:goldsky` usa `${SLUG_STUDIO}-${NETWORK}/v1.0.13-uni`. Algumas chains usam slug específico — registrado no campo `goldskySlug` do `subgraph/config/<chain>.json` e refletido em script dedicado em `subgraph/package.json`. Exemplos atuais:

| Config | goldskySlug | Script |
|---|---|---|
| `arbmain.json` | `snf-arbitrum-old` | `deploy:goldsky:arbmain-old` |
| `maticmain.json` | `snf-polygon-old` | `deploy:goldsky:maticmain-old` |
| `mainnet-old.json` | `snf-mainnet-old` | `deploy:goldsky:mainnet-old` |
| `basemain-old.json` | `snf-base-old` | `deploy:goldsky:basemain-old` |
| `maticmain-new.json` | `snf-polygon` | `deploy:goldsky:maticmain-new` |
| `arbmain-new.json` | `snf-arbitrum` | `deploy:goldsky:arbmain-new` |

### Validar deploy

```powershell
curl -X POST <subgraph-url> -H "content-type: application/json" `
  -d '{\"query\":\"{ _meta { block { number } hasIndexingErrors } pairs(first: 3) { id reserveUSD } }\"}'
```

`_meta.hasIndexingErrors` deve ser `false`. Se aparecer pair com `reserveUSD` real, o pricing.ts está populado pra essa chain.

### Stable pools para preço USD

`subgraph/src/mappings/pricing.ts` → `getStableWethPairs()` lista os SnF pairs WETH/USDC (ou similar) por chain. Sem entrada → `Bundle.ethPrice` fica 0 → `reserveUSD/volumeUSD` ficam 0. Reservas e volumes em unidades de token continuam corretos.

Para popular: descobrir endereço do pair WETH/stable on-chain (`factory.getPair(WETH, USDC)`), checar reservas, adicionar em pricing.ts, redeployar o subgraph.

---

## Gotchas conhecidos

### Bug do ethers v5 com `to: null` em contract creation

Algumas RPCs retornam `to: null` em transaction responses para CREATE txs. ethers v5 `Formatter.transactionResponse` falha com `INVALID_ARGUMENT`. **O contrato foi deployado** — só o post-processing crashou. `scripts/library.ts` tem catch que recupera via `provider.waitForTransaction(hash)` extraindo `receipt.contractAddress`. Transparente.

### Etherscan V2 — `apiKey` precisa ser STRING

Em `hardhat.config.ts`, `etherscan.apiKey` deve ser passado como string única (não objeto `{ network: key }`). Objeto aciona o fluxo V1 deprecado. V2 unifica todas as chains com `?chainid=N` no query string.

`@nomicfoundation/hardhat-verify` 2.1.3 é a última 2.x compatível com Hardhat 2. A 3.x exige Hardhat 3.

### Windows line endings vs `os.EOL`

Sanity checks em `deploy.ts` usam `split(/\r?\n/)` (não `EOL`) porque arquivos auto-gerados por `prepare.ts` usam `\n` enquanto Windows reporta `EOL = \r\n`. Misturar quebra os checks (filtra tudo como uma linha de comentário).

### Comparação de address case

Use sempre `.toLowerCase()` em ambos lados ao comparar addresses entre on-chain (ethers normalizado) e source files (escritos manualmente). Checksum EIP-55 pode divergir.

### Polygon RPC default não funciona

`polygon-rpc.com` retorna timeout/network error frequentemente. `hardhat.config.ts` usa Alchemy (`https://polygon-mainnet.g.alchemy.com/v2/<key>`) quando `ALCHEMY_KEY` está no env. Idem para Arbitrum (`arb-mainnet.g.alchemy.com`) e Base.

### Hardhat fork em Polygon falha com "no hardfork history"

`--network hardhat` (fork local) na Polygon dá `No known hardfork for execution on historical block ... in chain with id 137`. Pular o fork e ir direto pra `--network livenet`. O sanity checks do deploy.ts detecta erros de config antes de qualquer tx.

### Goldsky CLI no Windows imprime caracteres que CMD interpreta como comando

`pnpm goldsky:login` via wrapper Node às vezes produz output tipo `'projectID:project_xxx' não é reconhecido como comando`. O login funciona — só o post-processing do output quebra. Workaround: rodar `npx goldsky login --token "$KEY"` direto via bash, com `--force` quando aplicável.

### Goldsky CLI export wrappers só funcionam em bash

Scripts `subgraph/package.json` usam `export \`cat .env | egrep ... | xargs\`` — sintaxe bash. No PowerShell falha. Use Git Bash ou WSL.

### Inline comments em `.env` quebram bash extraction

Linha `GOLDSKY_API_KEY=abc #comentário` faz `cut -d= -f2` retornar `abc #comentário`. Use Node pra parsear: `node -e "const m=fs.readFileSync('.env','utf8').match(/^GOLDSKY_API_KEY=(\S+)/m);process.stdout.write(m[1])"`.

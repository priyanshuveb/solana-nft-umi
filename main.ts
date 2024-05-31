import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, generateSigner, createSignerFromKeypair, percentAmount, some, transactionBuilder } from '@metaplex-foundation/umi'
import { TokenStandard, createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  create, mplCandyMachine, fetchCandyMachine,
  fetchCandyGuard,
  addConfigLines, mintV2
} from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import fs from 'fs';
import * as bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js'
// Use the RPC endpoint of your choice.
const umi = createUmi('https://api.devnet.solana.com ').use(mplCandyMachine()).use(mplTokenMetadata())

// Import your private key file and parse it.
const wallet = './owner.json'
const secretKey = JSON.parse(fs.readFileSync(wallet, 'utf-8'))

// Create a keypair from your private key
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
// console.log(keypair);

// Register it to the Umi client.
umi.use(keypairIdentity(keypair))

// This creates a random signer object
const myCustomAuthority = generateSigner(umi)
//console.log({myCustomAuthority});

// This creates the signer of the keypair provided
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
//console.log(myKeypairSigner.publicKey);

// This will be used as the collection nft address
const collectionMint = generateSigner(umi);
console.log({collectionMint});

const candyMachine = generateSigner(umi);
console.log({ candyMachine });

const nftMint = generateSigner(umi)



async function main() {
  // Collection nft
  await createNft(umi, {
    mint: collectionMint,
    authority: myKeypairSigner,
    name: 'yolo0',
    symbol: '99Sixx',
    uri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft-umi/main/assets/collection.json',
    sellerFeeBasisPoints: percentAmount(15, 2), // 5%
    isCollection: true,
  }).sendAndConfirm(umi)

  // `symbol` defaults to an empty string — i.e. minted NFTs don’t use symbols.
  // `maxEditionSupply` defaults to zero — i.e. minted NFTs are not printable.
  // const candyMachineSettings = {
  //   candyMachine,
  //   collectionMint: collectionMint.publicKey,
  //   collectionUpdateAuthority: myKeypairSigner,
  //   authority: myKeypairSigner,
  //   tokenStandard: TokenStandard.NonFungible,
  //   sellerFeeBasisPoints: percentAmount(20, 2),
  //   symbol: '99Sixx',
  //   maxEditionSupply: 0,
  //   isMutable: true,
  //   creators: [
  //     { address: myKeypairSigner.publicKey, percentageShare: 100, verified: false }
  //   ],
  //   itemsAvailable: 50,
  //   configLineSettings: some({
  //     prefixName: '',
  //     nameLength: 32,
  //     prefixUri: '',
  //     uriLength: 200,
  //     isSequential: false,
  //   }),
  // }

  // Create candy machine

  await (await create(umi, {
    candyMachine,
    collectionMint: collectionMint.publicKey,
    collectionUpdateAuthority: myKeypairSigner,
    authority: myKeypairSigner.publicKey,
    tokenStandard: TokenStandard.NonFungible,
    sellerFeeBasisPoints: percentAmount(20, 2),
    symbol: '99Sixx',
    maxEditionSupply: 0,
    isMutable: true,
    creators: [
      { address: myKeypairSigner.publicKey, percentageShare: 100, verified: false }
    ],
    itemsAvailable: 2,
    configLineSettings: some({
      prefixName: '',
      nameLength: 32,
      prefixUri: '',
      uriLength: 200,
      isSequential: false,
    }),
  })).sendAndConfirm(umi)

  await addConfigLines(umi, {
    candyMachine: candyMachine.publicKey,
    index: 0,
    configLines: [
      { name: 'My NFT #1', uri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft-umi/main/assets/0.json' },
      { name: 'My NFT #2', uri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft-umi/main/assets/1.json' },
    ],
  }).sendAndConfirm(umi)

  // const myCandyMachine = await fetchCandyMachine(umi, candyMachine.publicKey)

  // const { signature } = await transactionBuilder()
  // .add(setComputeUnitLimit(umi, { units: 800_000 }))
  // .add(
  //   mintV2(umi, {
  //     candyMachine: candyMachine.publicKey,
  //     nftMint,
  //     collectionMint: collectionMint.publicKey,
  //     collectionUpdateAuthority: myKeypairSigner.publicKey,
  //     tokenStandard: TokenStandard.NonFungible,
  //     candyGuard: myCandyMachine.mintAuthority,
  //   //   mintArgs: {
  //   //     mintLimit: some({ id: 1 }),
  //   // },
  //   })
  // )
  // .sendAndConfirm(umi)

  // const txid = bs58.encode(signature);
  // console.log({ txid });
}

// async function upload() {
//   await addConfigLines(umi, {
//     candyMachine: candyMachine.publicKey,
//     index: 0,
//     configLines: [
//       { name: 'My NFT #1', uri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft-umi/main/assets/0.json' },
//       // { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
//     ],
//   }).sendAndConfirm(umi)

// }

async function mint() {

  // const key = new PublicKey("3HJrxvbCcAegqeqmbeceEMrHbWiVdUCRXGraPf8wnsVW")
  const candySecretKey = [
    80,  92, 224,  66,  48,  52, 210, 243, 177, 160,  32,
        1,  62, 119, 123,  40, 173,  45, 113,  79, 100,   1,
       41,  59, 167, 237, 232, 235, 151, 116, 232,  90, 188,
      102, 247, 151, 189,  11, 106,   5, 118,  12,   4,  18,
      234,  99,  31,  76, 219, 138,  25,   5, 173, 210, 146,
      120, 217, 241,  19, 134, 156,  64, 106,   3
  ]

  const collectionSecretkey = [
    50,   2,  62,  94,  95, 195,  69,  93, 231,  30,  43,
    39, 173,   6, 195, 191, 106, 163,  70,  64, 247,  24,
   168,  16, 171, 139,  15, 254,  16,  80, 239,  68, 204,
   239,  78, 176, 154,   8, 178, 170,  76, 148, 140, 192,
    53,  66, 223,  51, 203, 150, 185, 122,  38, 217, 197,
    36, 145,  35,  40,  54, 230, 216, 135, 225
 ]
  const key = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(candySecretKey))
  const candySigner = createSignerFromKeypair(umi, key);
  const myCandyMachine = await fetchCandyMachine(umi, candySigner.publicKey)

  const keyCollection = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(collectionSecretkey))
  const collectionSigner = createSignerFromKeypair(umi, keyCollection);

  console.log(collectionSigner.publicKey);
  

  const { signature } = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: myCandyMachine.publicKey,
        nftMint,
        collectionMint: collectionSigner.publicKey,
        collectionUpdateAuthority: myKeypairSigner.publicKey,
        tokenStandard: TokenStandard.NonFungible,
        candyGuard: myCandyMachine.mintAuthority,
        //   mintArgs: {
        //     mintLimit: some({ id: 1 }),
        // },
      })
    )
    .sendAndConfirm(umi)

  const txid = bs58.encode(signature);
  console.log({ txid });
}

//main()
 mint()

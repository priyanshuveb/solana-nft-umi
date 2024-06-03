#pubkey: i5QSzYrHDuB2BCR69yoMJG3bMe64iPqsCcvMSSJDYA8
#seed: next glide arrest lesson achieve remain novel unfair anxiety layer patient early
solana-keygen new --no-bip39-passphrase --outfile ./owner.json
#pubkey: pA1biUsXcVPpUAGHYXcrPrU5ncWwJVqWuPRFAvWdgHF
#seed: hollow purity evidence napkin merry pause fever pioneer claw pill elite meadow
solana-keygen new --no-bip39-passphrase --outfile ./creator.json


solana config set --keypair ./owner.json
solana address
solana config set --url https://api.devnet.solana.com
solana config get

solana airdrop 5
solana balance

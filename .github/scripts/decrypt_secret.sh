#!/bin/sh

mkdir $HOME/secrets

gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output $HOME/secrets/my_secret.json ./.github/scripts/my_secret.json.gpg

mkdir -p ~/private_keys

gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output ~/private_keys/AuthKey.p8 ./.github/scripts/AuthKey.p8.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output ~/private_keys/CSCKey.p12 ./.github/scripts/CSCKey.p12.gpg
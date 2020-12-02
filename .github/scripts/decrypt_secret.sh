#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
--output $HOME/secrets/AuthKey_C3HY5T92K2.p8 ./.github/scripts/AuthKey_C3HY5T92K2.p8.gpg
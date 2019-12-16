import WalletService from '@/services/wallet'

export default {
  methods: {
    /**
     * Encrypt the wallet passphrase if has a password and store it
     */
    async onCreate () {
      this.wallet = {
        ...this.schema,
        profileId: this.session_profile.id
      }
      // NOTE: this property is only used on `WalletImport`
      if (!this.useOnlyAddress) {
        this.wallet.publicKey = WalletService.getPublicKeyFromPassphrase(this.wallet.passphrase)
      }

      if (!this.useOnlyAddress && this.walletPassword && this.walletPassword.length) {
        this.showEncryptLoader = true

        const dataToEncrypt = {
          passphrase: this.wallet.passphrase,
          password: this.walletPassword,
          wif: this.session_network.wif
        }

        let failed = false
        try {
          const { bip38key } = await this.bip38_encrypt(dataToEncrypt)
          console.log('bip38 onCreate bip38key', bip38key)
          this.wallet.passphrase = bip38key
        } catch (error) {
          this.$logger.error('Failed to encrypt:', error)
          this.$error(this.$t('ENCRYPTION.FAILED_ENCRYPT'))
          failed = true
        }

        this.showEncryptLoader = false

        if (failed) {
          return
        }
      } else {
        this.wallet.passphrase = null
      }

      this.createWallet()
    }
  }
}

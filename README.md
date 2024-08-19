# Crede Wallet - React Native

## Description
I started the project in 2023 as the solo dev, and a few months later had another fe dev added to my team. So we both wrote about 50% of the code in this project. It is an app that is a non-custodial wallet for EVM based cryptocurrencies. It uses shamir secret algorithm to enable the recovery of a non-custodial mnemonic and secret key. About 2 days before I was scheduled to submit the app for approval by Google and Apple we had a change in our company's leadership and the project was paused and eventually dropped.

### dev instructions - in order to do OTA (over the air) updates:

1. set the dev environment ("staging", "production", "development")
   staging:
   `export DEPLOY_ENVIRONMENT=staging`

production:
`export DEPLOY_ENVIRONMENT=production`

2. update the branch that the BUILD CHANNEL is pointed to. (in app.config.js, each environment 'channel' attribute is the channel the build is associated with.)
   Updating a branch, will update ALL BUILDS that have a channel pointed to that branch.

staging env current builds branch: expo-staging
production env current builds branch: expo-production

staging:
`eas update --branch expo-staging --message "[your message here]"`

production:
`eas update --branch expo-production --message "[your message here]"`

## seeing current env channels and branches

`eas channel:list`
`eas branch:list`

## in order to do OTA (over the air) updates:

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

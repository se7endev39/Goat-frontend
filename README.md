# XDITTO Frontend

## Deployment
This repo is being managed by a dokku instance on `serv.ditto.money`

The steps to deploy to production are:
1. Message @venariuss or @chefchansey on telegram and provide your public rsa key
2. `git remote add dokku dokku@serv.ditto.money:xditto-frontend`

After these intital steps you can deploy the new version of the app just by pushing your changes:
1. `git push dokku main:master`

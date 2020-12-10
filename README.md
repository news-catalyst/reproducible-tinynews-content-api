# reproducible tinynews content-api

This is a [Webiny](https://docs.webiny.com/) installation that has a custom API service setup. This custom service is where the default content models and graphql queries & mutations are configured.

Work on this is underway right now; more details tk.

## Where to find the custom setup

You can find content model definitions in [api/tinynews-models/src/plugins/models](api/tinynews-models/src/plugins/models).

The GraphQL setup for queries, mutations and models is in [api/tinynews-models/src/plugins/graphql.ts](api/tinynews-models/src/plugins/graphql.ts).

## Deploy

To create a new version of the API, for instance for a new tiny news company, pick a unique project name (ex: contentapi-tnc-1234) and do the following:

* edit the `projectName` in webiny.root.js
* set env-specific names for `MONGODB_NAME` (ex: contentapi-tnc-1234-prod) in .env.json
* set env-specific names the `S3_BUCKET` value in api/.env.json (you can use the same values as MONGODB_NAME here)
* update the name in package.json (though I need to confirm whether this is necessary)

Then run the following commands, replacing `prod` with the desired environment (`dev` or `local` are other options):

```
$ yarn webiny deploy api --env=prod
```

Then start the admin app locally - it will be pointed at your newly deployed API. 

You need to set a few things up:

* webiny requirements: security, i18n (default locale), page builder, form builder
* then get a Personal Access Token (PAT) to access the GraphQL API (save this somewhere safe)
* finally setup the site locales

Here's how:

```
cd apps/admin
yarn start
# this should open the admin in your browser at [http://localhost:3000](http://localhost:3000) - click through the screens
open http://localhost:3000/users # click "Create Token" on this page for the PAT under Security > Users
open http://localhost:3000/i18n/locales # add whatever languages this site should support under Languages > Locales (menu)
```

Save the API URL returned from the first command somewhere safe. We'll need that to configure the front-end app.


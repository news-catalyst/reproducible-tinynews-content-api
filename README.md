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
$ yarn webiny deploy apps --env=prod
```

Save the API URL returned from the first command somewhere safe. We'll need that to configure the front-end app.

Open the URL returned from the second command, it will bring you the admin webiny cms. Click through to get that up and running. You'll have to do two things here:

* Set up a Personal Access Token; be sure to copy this value somewhere safe.
* Set up the site locales

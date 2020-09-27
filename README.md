# reproducible tinynews content-api

This is a [Webiny](https://docs.webiny.com/) installation that has a custom API service setup. This custom service is where the default content models and graphql queries & mutations are configured.

Work on this is underway right now; more details tk.

## Where to find the custom setup

You can find content model definitions in [api/tinynews-models/src/plugins/models](api/tinynews-models/src/plugins/models).

The GraphQL setup for queries, mutations and models is in [api/tinynews-models/src/plugins/graphql.ts](api/tinynews-models/src/plugins/graphql.ts).

## Deploy

```
yarn webiny deploy api --env=prod
```
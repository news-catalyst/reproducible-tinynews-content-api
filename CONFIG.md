# Site Configurations

## contentapi-base-prod

This is the main API stack setup for our tiny news demo.

* GraphQL API: https://d19u1w7eqbvlum.cloudfront.net/graphql
* Personal Access Token: `4ff06734a8db0557700c86a9345fbe18eefcce3718d08d45`

To deploy: `yarn webiny deploy api --env=prod`

To configure settings in the admin:

```
cd apps/admin
yarn start
```

### Customer specific environments

Since Webiny does not currently support multi-tenant sites, we're using environments to manage our different customer API, admin and front-end site stacks.

To add a customer, setup a new env:

1. Copy the `prod` env from `.env.json`, changing the label and mongodb name
2. Copy the `prod` env from `api/.env.json`, changing the label and S3 bucket name
3. Start the admin app in the new environment; I'm currently just editing the script entry for `start` in `apps/admin/package.json` to do this but would probably make more sense to do this better.

## contentapi-base-oaklyn

An example customer-specific environment used to deploy and run a client's webiny tech stack.

To deploy: `yarn webiny deploy api --env=oaklyn`

* GraphQL API: [https://djomoky4uky4c.cloudfront.net/graphql](https://djomoky4uky4c.cloudfront.net/graphql)
* Personal Access Token: `3bef2afc707373384a344c158d0ed966acaf0ca52c7c5fab`
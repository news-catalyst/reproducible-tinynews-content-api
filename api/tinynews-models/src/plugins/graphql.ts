import { merge } from "lodash";
import gql from "graphql-tag";
import { GraphQLSchemaPlugin } from "@webiny/graphql/types";
import {
    I18NStringValueType,
    I18NJSONValueType,
    I18NStringValueInput,
    I18NJSONValueInput
} from "@webiny/api-i18n/graphql";

import {
    emptyResolver
} from "@webiny/commodo-graphql";
import article from "./graphql/Article";
import author from "./graphql/Author";
import category from "./graphql/Category";
import homepageLayoutData from "./graphql/HomepageLayoutData";
import homepageLayoutSchema from "./graphql/HomepageLayoutSchema";
import page from "./graphql/Page";
import tag from "./graphql/Tag";

/**
 * As the name itself suggests, the "graphql-schema" plugin enables us to define our service's GraphQL schema.
 * Use the "schema" and "resolvers" properties to define GraphQL types and resolvers, respectively.
 * Resolvers can be made from scratch, but to make it a bit easier, we rely on a couple of built-in generic
 * resolvers, imported from the "@webiny/commodo-graphql" package.
 *
 * @see https://docs.webiny.com/docs/api-development/graphql
 */
const plugin: GraphQLSchemaPlugin = {
    type: "graphql-schema",
    name: "graphql-schema-tinynews",
    schema: {
        typeDefs: gql`
            ${I18NStringValueType()}
            ${I18NJSONValueType()}
            ${I18NStringValueInput()}
            ${I18NJSONValueInput()}

            ${article.typeDefs}
            ${author.typeDefs}
            ${category.typeDefs}
            ${homepageLayoutData.typeDefs}
            ${homepageLayoutSchema.typeDefs}
            ${page.typeDefs}
            ${tag.typeDefs}

            input CmsRefListInput {
                values: [CmsRefListLocalizedInput]
            }
            
            input CmsRefListLocalizedInput {
                value: [RefInput]
                locale: ID!
            }

            input CmsRefLocalizedInput {
                value: RefInput
                locale: ID!
            }

            input CmsRefInput {
                values: [CmsRefLocalizedInput]
            }

            extend type Query {
                articles: ArticleQuery
                authors: AuthorQuery
                categories: CategoryQuery
                homepageLayoutDatas: HomepageLayoutDataQuery
                homepageLayoutSchemas: HomepageLayoutSchemaQuery
                pages: PageQuery
                tags: TagQuery
            }

            extend type Mutation {
                articles: ArticleMutation
                authors: AuthorMutation
                categories: CategoryMutation
                homepageLayoutDatas: HomepageLayoutDataMutation
                homepageLayoutSchemas: HomepageLayoutSchemaMutation
                pages: PageMutation
                tags: TagMutation
            }
        `,
        resolvers: merge(
            {
                Query: {
                    // Needs to be here, otherwise the resolvers below cannot return any result.
                    articles: emptyResolver,
                    authors: emptyResolver,
                    categories: emptyResolver,
                    homepageLayoutDatas: emptyResolver,
                    homepageLayoutSchemas: emptyResolver,
                    pages: emptyResolver,
                    tags: emptyResolver
                },
                Mutation: {
                    // Needs to be here, otherwise the resolvers below cannot return any result.
                    articles: emptyResolver,
                    authors: emptyResolver,
                    categories: emptyResolver,
                    homepageLayoutDatas: emptyResolver,
                    homepageLayoutSchemas: emptyResolver,
                    pages: emptyResolver,
                    tags: emptyResolver
                }
            },
            article.resolvers,
            author.resolvers,
            category.resolvers,
            homepageLayoutData.resolvers,
            homepageLayoutSchema.resolvers,
            page.resolvers,
            tag.resolvers,
        )
    }
};

export default plugin;

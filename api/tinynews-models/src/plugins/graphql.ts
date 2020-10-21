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
import siteMetadata from "./graphql/SiteMetadata";

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
            ${siteMetadata.typeDefs}
            ${tag.typeDefs}

            type CmsBoolean {
                value(locale: String): Boolean
                values: [CmsBooleanLocalized]!
              }
              
              input CmsBooleanInput {
                values: [CmsBooleanLocalizedInput]
              }
              
              type CmsBooleanList {
                value: [Boolean]
                values: [CmsBooleanListLocalized]!
              }
              
              input CmsBooleanListInput {
                values: [CmsBooleanListLocalizedInput]
              }
              
              type CmsBooleanListLocalized {
                value(locale: String): [Boolean]
                locale: ID!
              }
              
              input CmsBooleanListLocalizedInput {
                value: [Boolean]
                locale: ID!
              }
              
              type CmsBooleanLocalized {
                value: Boolean
                locale: ID!
              }
              
              input CmsBooleanLocalizedInput {
                value: Boolean
                locale: ID!
              }
            type CmsDateTime {
                value(locale: String): String
                values: [CmsDateTimeLocalized]!
              }
              
              input CmsDateTimeInput {
                values: [CmsDateTimeLocalizedInput]
              }
              
              type CmsDateTimeList {
                value: [String]
                values: [CmsDateTimeListLocalized]!
              }
              
              input CmsDateTimeListInput {
                values: [CmsDateTimeListLocalizedInput]
              }
              
              type CmsDateTimeListLocalized {
                value(locale: String): [String]
                locale: ID!
              }
              
              input CmsDateTimeListLocalizedInput {
                value: [String]
                locale: ID!
              }
              
              type CmsDateTimeLocalized {
                value: String
                locale: ID!
              }
              
              input CmsDateTimeLocalizedInput {
                value: String
                locale: ID!
              }
              
              type CmsDateTimeWithTz {
                value(locale: String): String
                values: [CmsDateTimeWithTzLocalized]!
              }
              
              input CmsDateTimeWithTzInput {
                values: [CmsDateTimeWithTzLocalizedInput]
              }
              
              type CmsDateTimeWithTzList {
                value: [String]
                values: [CmsDateTimeWithTzListLocalized]!
              }
              
              input CmsDateTimeWithTzListInput {
                values: [CmsDateTimeWithTzListLocalizedInput]
              }
              
              type CmsDateTimeWithTzListLocalized {
                value(locale: String): [String]
                locale: ID!
              }
              
              input CmsDateTimeWithTzListLocalizedInput {
                value: [String]
                locale: ID!
              }
              
              type CmsDateTimeWithTzLocalized {
                value: String
                locale: ID!
              }
              
              input CmsDateTimeWithTzLocalizedInput {
                value: String
                locale: ID!
              }

            type CmsText {
                value(locale: String): String
                values: [CmsTextLocalized]!
              }
              
              input CmsTextInput {
                values: [CmsTextLocalizedInput]
              }
              
              type CmsTextList {
                value: [String]
                values: [CmsTextListLocalized]!
              }
              
              input CmsTextListInput {
                values: [CmsTextListLocalizedInput]
              }
              
              type CmsTextListLocalized {
                value(locale: String): [String]
                locale: ID!
              }
              
              input CmsTextListLocalizedInput {
                value: [String]
                locale: ID!
              }
              
              type CmsTextLocalized {
                value: String
                locale: ID!
              }
              
              input CmsTextLocalizedInput {
                value: String
                locale: ID!
              }

              type CmsLongText {
                value(locale: String): String
                values: [CmsLongTextLocalized]!
              }
              
              input CmsLongTextInput {
                values: [CmsLongTextLocalizedInput]
              }
              
              type CmsLongTextList {
                value: [String]
                values: [CmsLongTextListLocalized]!
              }
              
              input CmsLongTextListInput {
                values: [CmsLongTextListLocalizedInput]
              }
              
              type CmsLongTextListLocalized {
                value(locale: String): [String]
                locale: ID!
              }
              
              input CmsLongTextListLocalizedInput {
                value: [String]
                locale: ID!
              }
              
              type CmsLongTextLocalized {
                value: String
                locale: ID!
              }
              
              input CmsLongTextLocalizedInput {
                value: String
                locale: ID!
              }
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
                siteMetadatas: SiteMetadataQuery
                tags: TagQuery
            }

            extend type Mutation {
                articles: ArticleMutation
                authors: AuthorMutation
                categories: CategoryMutation
                homepageLayoutDatas: HomepageLayoutDataMutation
                homepageLayoutSchemas: HomepageLayoutSchemaMutation
                pages: PageMutation
                siteMetadatas: SiteMetadataMutation
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
                    siteMetadatas: emptyResolver,
                    tags: emptyResolver,
                },
                Mutation: {
                    // Needs to be here, otherwise the resolvers below cannot return any result.
                    articles: emptyResolver,
                    authors: emptyResolver,
                    categories: emptyResolver,
                    homepageLayoutDatas: emptyResolver,
                    homepageLayoutSchemas: emptyResolver,
                    pages: emptyResolver,
                    siteMetadatas: emptyResolver,
                    tags: emptyResolver,
                }
            },
            article.resolvers,
            author.resolvers,
            category.resolvers,
            homepageLayoutData.resolvers,
            homepageLayoutSchema.resolvers,
            page.resolvers,
            siteMetadata.resolvers,
            tag.resolvers,
        )
    }
};

export default plugin;

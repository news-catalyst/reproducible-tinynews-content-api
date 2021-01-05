import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveUpdate
} from "@webiny/commodo-graphql";
import { resolveCreateFrom, resolveArticleList } from "./resolver";
// import resolveCreateFrom from "./resolveCreateFrom";

const articleFetcher = ctx => ctx.models.Article;

export default {
  typeDefs: `
    type ArticleDeleteResponse {
        data: Boolean
        error: ArticleError
    }

    type ArticleCursors {
        next: String
        previous: String
    }

    type ArticleListMeta {
        cursors: ArticleCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type ArticleError {
        code: String
        message: String
        data: JSON
    }

    type CmsRefArticleAuthorsList {
      value(locale: String): [Author]
      values: [CmsRefArticleAuthorsListLocalized]!
    }
    
    type CmsRefArticleAuthorsListLocalized {
      value: [Author]
      locale: ID!
    }

    type CmsRefArticleTagsList {
        value(locale: String): [Tag]
        values: [CmsRefArticleTagsListLocalized]!
    }
      
    type CmsRefArticleTagsListLocalized {
        value: [Tag]
        locale: ID!
    }

    type CmsRefArticleCategory {
        value(locale: String): Category
        values: [CmsRefArticleCategoryLocalized]!
      }
      
    type CmsRefArticleCategoryLocalized {
        value: Category
        locale: ID!
    }
    type TestLocaleStringValue {
        locale: String!
        value: String
    }
    input TestLocaleStringValueInput {
        locale: String!
        value: String
    }
    type TestLocaleStringValueContainer {
        values: [TestLocaleStringValue]
    }

    input TestLocaleStringValueContainerInput {
        values: [TestLocaleStringValueInput]
    }

    type Article {
        id: ID
        version: Int
        published: Boolean
        latestVersion: Boolean
        parent: ID
        revisions: [Article]
        availableLocales: String
        headline: I18NStringValue
        lang: TestLocaleStringValueContainer
        content: I18NStringValue
        authorSlugs: String
        slug: String
        headlineSearch: String
        customByline: String
        searchTitle: I18NStringValue
        searchDescription: I18NStringValue
        twitterTitle: I18NStringValue
        twitterDescription: I18NStringValue
        facebookTitle: I18NStringValue
        facebookDescription: I18NStringValue
        createdOn: DateTime
        updatedOn: DateTime
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        googleDocs: String
        docIDs: String
        category: Category
        authors: [Author]
        tags: [Tag]
    }

    input ArticleInput {
        id: ID
        availableLocales: String
        headline: I18NStringValueInput
        lang: TestLocaleStringValueContainerInput
        content: I18NStringValueInput
        authorSlugs: String
        slug: String
        headlineSearch: String
        customByline: String
        searchTitle: I18NStringValueInput
        searchDescription: I18NStringValueInput
        twitterTitle: I18NStringValueInput
        twitterDescription: I18NStringValueInput
        facebookTitle: I18NStringValueInput
        facebookDescription: I18NStringValueInput
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        published: Boolean
        googleDocs: String
        docIDs: String
        category: RefInput
        authors: [RefInput]
        tags: [RefInput]
    }

    input ArticleListWhere {
        headline: String
        headline_contains: String
        slug: String
        authorSlugs_contains: String
        availableLocales_contains: String
        docIDs_contains: String
    }

    input ArticleListSort {
        headline: Int
        createdOn: Int
        firstPublishedOn: Int
    }

    type ArticleResponse {
        data: Article
        error: ArticleError
    }

    type ArticleListResponse {
        data: [Article]
        meta: ArticleListMeta
        error: ArticleError
    }

    type ArticleQuery {
        getArticle(id: ID): ArticleResponse

        listArticles(
            where: ArticleListWhere
            sort: ArticleListSort
            limit: Int
            after: String
            before: String
        ): ArticleListResponse
    }

    type ArticleMutation {
        createArticle(data: ArticleInput!): ArticleResponse

        createArticleFrom(revision: ID!, data: ArticleInput!): ArticleResponse

        updateArticle(id: ID!, data: ArticleInput!): ArticleResponse

        deleteArticle(id: ID!): ArticleDeleteResponse
    }
  `,
  resolvers: {
    ArticleQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getArticle: hasScope("articles:get")(resolveGet(articleFetcher)),
        listArticles: hasScope("articles:list")(resolveArticleList(articleFetcher))
    },
    ArticleMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createArticle: hasScope("articles:create")(resolveCreate(articleFetcher)),
        createArticleFrom: hasScope("articles:createFrom")(resolveCreateFrom(articleFetcher)),
        updateArticle: hasScope("articles:update")(resolveUpdate(articleFetcher)),
        deleteArticle: hasScope("articles:delete")(resolveDelete(articleFetcher))
    },
  }
}
import { hasScope } from "@webiny/api-security";
import {
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const siteMetadataFetcher = ctx => ctx.models.SiteMetadata;

export default {
  typeDefs: `
    type SiteMetadataDeleteResponse {
        data: Boolean
        error: SiteMetadataError
    }

    type SiteMetadataCursors {
        next: String
        previous: String
    }

    type SiteMetadataListMeta {
        cursors: SiteMetadataCursors
        hasNextPage: Boolean
        hasPreviousPage: Boolean
        totalCount: Int
    }

    type SiteMetadataError {
        code: String
        message: String
        data: JSON
    }

    type SiteMetadata {
        id: ID
        name: String
        description: String
        logo: String
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        published: Boolean
    }

    input SiteMetadataInput {
        id: ID
        name: String
        description: String
        logo: String
        firstPublishedOn: DateTime
        lastPublishedOn: DateTime
        published: Boolean
    }

    input SiteMetadataListWhere {
        name: String
        published: Boolean
    }

    input SiteMetadataListSort {
        name: Int
        firstPublishedOn: Int
    }

    type SiteMetadataResponse {
        data: SiteMetadata
        error: SiteMetadataError
    }

    type SiteMetadataListResponse {
        data: [SiteMetadata]
        meta: SiteMetadataListMeta
        error: SiteMetadataError
    }

    type SiteMetadataQuery {
        getSiteMetadata(id: ID): SiteMetadataResponse

        listSiteMetadatas(
            where: SiteMetadataListWhere
            sort: SiteMetadataListSort
            limit: Int
            after: String
            before: String
        ): SiteMetadataListResponse
    }

    type SiteMetadataMutation {
        createSiteMetadata(data: SiteMetadataInput!): SiteMetadataResponse

        updateSiteMetadata(id: ID!, data: SiteMetadataInput!): SiteMetadataResponse

        deleteSiteMetadata(id: ID!): SiteMetadataDeleteResponse
    }

  `,
  resolvers: {
    SiteMetadataQuery: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        getSiteMetadata: hasScope("siteMetadatas:get")(resolveGet(siteMetadataFetcher)),
        listSiteMetadatas: hasScope("siteMetadatas:list")(resolveList(siteMetadataFetcher))
    },
    SiteMetadataMutation: {
        // With the generic resolvers, we also rely on the "hasScope" helper function from the
        // "@webiny/api-security" package, in order to define the required security scopes (permissions).
        createSiteMetadata: hasScope("siteMetadatas:create")(resolveCreate(siteMetadataFetcher)),
        updateSiteMetadata: hasScope("siteMetadatas:update")(resolveUpdate(siteMetadataFetcher)),
        deleteSiteMetadata: hasScope("siteMetadatas:delete")(resolveDelete(siteMetadataFetcher))
    }
  }
}
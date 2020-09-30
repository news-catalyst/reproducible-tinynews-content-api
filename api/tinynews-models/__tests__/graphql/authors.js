// We use these fields in every query / mutation below.
const ERROR_FIELDS = /* GraphQL */ `
    {
        code
        message
        data
    }
`;

// A basic create "Author" mutation.
export const CREATE_AUTHOR = /* GraphQL */ `
mutation CreateAuthor($data: AuthorInput!) {
    authors {
        createAuthor(data: $data) {
            data {
                id
                name
                bio {
                  values {
                    value
                  }
                }
                title {
                    values {
                    value
                    }
                }
                photoUrl
                twitter
                slug
            }
            error ${ERROR_FIELDS}
        }
    }
}
`;

// A basic list "Articles" query.
export const LIST_AUTHORS = /* GraphQL */ `
{
    authors	{
      listAuthors {
        error ${ERROR_FIELDS}
        data {
          id
          name
          bio {
            values {
              value
            }
          }
          twitter
          title {
            values {
              value
            }
          }
          slug
          photoUrl
        }
      }
    }
  }
`;

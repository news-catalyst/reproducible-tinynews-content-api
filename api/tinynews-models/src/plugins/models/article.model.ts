// @ts-ignore
import { withFields, withName, string, ref, pipe } from "@webiny/commodo";
import { flow } from "lodash";
import { validation } from "@webiny/validation";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
// style using `flow` found in https://github.com/fsdevcoder/webiny-js-new/blob/68e2533a1a7c00124f57f6b73336463f122968ad/packages/api-security/src/plugins/models/securityGroup.model.ts
export default ({ createBase, context }) => {
    const Article: any = flow(
        withName("Article"),
        withFields(() => ({
            headline: string({ validation: validation.create("required,minLength:3") }),
            content: string(),
            authorSlugs: string(),
            customByline: string(),
            slug: string(),
            searchTitle: string(),
            searchDescription: string(),
            twitterTitle: string(),
            twitterDescription: string(),
            facebookTitle: string(),
            facebookDescription: string(),
            authors: ref({
                list: true,
                instanceOf: context.models.Author
            }),
            category: ref({
                list: false,
                instanceOf: context.models.Category
            })
        })),
    )(createBase());

    return Article;
};

// export default ({ createBase }) => 
//     pipe(
//         withName("Article"),
//         withFields(() => ({
//             // A simple "string" field, with a couple of validators attached.
//             headline: string({ validation: validation.create("required,minLength:3") }),
//             content: string(),
//             authorSlugs: string(),
//             customByline: string(),
//             slug: string(),
//             searchTitle: string(),
//             searchDescription: string(),
//             twitterTitle: string(),
//             twitterDescription: string(),
//             facebookTitle: string(),
//             facebookDescription: string(),
//             // authors: ref({ instanceOf: authorModel, list: true }),
//             category: ref({
//                 instanceOf: Category,
//                 list: false
//             })

//             // tags: ref({ instanceOf: tagModel, list: true }),
//         }))
//     )(createBase());

// @ts-ignore
import { withFields, withName, string, ref, pipe } from "@webiny/commodo";
import { validation } from "@webiny/validation";
import authorModel from "./author.model";
import categoryModel from "./category.model";
import tagModel from "./tag.model";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("Article"),
        withFields(() => ({
            // A simple "string" field, with a couple of validators attached.
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
            // authors: ref({ instanceOf: authorModel, list: true }),
            category: ref({ instanceOf: categoryModel, list: false }),
            // tags: ref({ instanceOf: tagModel, list: true }),
        }))
    )(createBase());

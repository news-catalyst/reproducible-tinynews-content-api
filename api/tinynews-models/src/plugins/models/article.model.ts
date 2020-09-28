// @ts-ignore
import { withFields, withName, i18nString, ref, string, pipe } from "@webiny/commodo";
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
            headline: i18nString({ validation: validation.create("required,minLength:3") }),
            content: i18nString(),
            authorSlugs: i18nString(),
            customByline: i18nString(),
            slug: string(),
            searchTitle: i18nString(),
            searchDescription: i18nString(),
            twitterTitle: i18nString(),
            twitterDescription: i18nString(),
            facebookTitle: i18nString(),
            facebookDescription: i18nString(),
            authors: ref({ instanceOf: authorModel, list: true }),
            category: ref({ instanceOf: categoryModel, list: false }),
            tags: ref({ instanceOf: tagModel, list: true }),
        }))
    )(createBase());

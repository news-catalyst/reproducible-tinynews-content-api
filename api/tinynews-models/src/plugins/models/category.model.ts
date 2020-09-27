// @ts-ignore
import { withFields, withName, i18nString, string, pipe } from "@webiny/commodo";
import { validation } from "@webiny/validation";

/**
 * A simple "Category" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("Category"),
        withFields(() => ({
            title: i18nString({ validation: validation.create("required,minLength:3") }),
            slug: string(),
        }))
    )(createBase());

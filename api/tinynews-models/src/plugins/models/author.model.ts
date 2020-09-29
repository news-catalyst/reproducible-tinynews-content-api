// @ts-ignore
import { withFields, withName, boolean, i18nString, string, pipe } from "@webiny/commodo";
import { validation } from "@webiny/validation";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("Author"),
        withFields(() => ({
            // A simple "string" field, with a couple of validators attached.
            name: string({ validation: validation.create("required,minLength:3") }),
            title: string(),
            bio: string(),
            twitter: string(),
            photoUrl: string(),
            staff: boolean(),
            slug: string(),
        }))
    )(createBase());

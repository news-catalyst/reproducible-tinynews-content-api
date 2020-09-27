// @ts-ignore
import { withFields, withName, string, pipe } from "@webiny/commodo";
import { validation } from "@webiny/validation";

/**
 * A simple "Tag" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("Tag"),
        withFields(() => ({
            title: string({ validation: validation.create("required,minLength:3") }),
            slug: string(),
        }))
    )(createBase());

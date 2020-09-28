// @ts-ignore
import { withFields, withName, string, pipe } from "@webiny/commodo";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("HomepageLayoutSchema"),
        withFields(() => ({
            name: string(),
            data: string(),
        }))
    )(createBase());

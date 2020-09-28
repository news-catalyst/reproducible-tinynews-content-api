// @ts-ignore
import { withFields, withName, ref, string, pipe } from "@webiny/commodo";
import homepageLayoutSchemaModel from "./homepageLayoutSchema.model";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("HomepageLayoutData"),
        withFields(() => ({
            data: string(),
            layoutSchema: ref({ instanceOf: homepageLayoutSchemaModel, list: false }),
        }))
    )(createBase());

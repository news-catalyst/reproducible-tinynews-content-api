// @ts-ignore
import { withFields, withName, boolean, string } from "@webiny/commodo";
import { i18nString } from "@webiny/api-i18n/fields";
import { flow } from "lodash";

/**
 * A simple "Article" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase, context }) => {
    const Author: any = flow(
        withName("Author"),
        withFields(() => ({
            // A simple "string" field, with a couple of validators attached.
            name: i18nString({ context }),
            title: i18nString({ context }),
            bio: i18nString({ context }),
            twitter: string(),
            photoUrl: string(),
            staff: boolean(),
            slug: string(),
        })),
    )(createBase());

    return Author;
};

// @ts-ignore
import { withFields, withName, boolean, string } from "@webiny/commodo";
import { i18nString } from "@webiny/api-i18n/fields";
import { flow } from "lodash";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Author = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Author) => {
    return flow(
        withName("Author"),
        withFields({
            name: string(),
            title: i18nString({ context }),
            bio: i18nString({context}),
            twitter: string(),
            photoUrl: string(),
            staff: boolean(),
            slug: string(),
            published: boolean({ value: false })
        })
    )(createBase());
};
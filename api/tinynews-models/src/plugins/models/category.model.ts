// @ts-ignore
import { withFields, withName, string } from "@webiny/commodo";
import { flow } from "lodash";
import { i18nString } from "@webiny/api-i18n/fields";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type Category = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: Category) => {
    return flow(
        withName("Category"),
        withFields({
            title: i18nString({ context }),
            slug: string()
        })
    )(createBase());
};

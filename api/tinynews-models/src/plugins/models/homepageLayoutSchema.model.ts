// @ts-ignore
import { withFields, withName, string, withHooks } from "@webiny/commodo";
import { flow } from "lodash";
import { Context as APIContext } from "@webiny/graphql/types";
import { Context as I18NContext } from "@webiny/api-i18n/types";
import { Context as CommodoContext } from "@webiny/api-plugin-commodo-db-proxy/types";

export type HomepageLayoutSchema = {
    createBase: any;
    context: APIContext & I18NContext & CommodoContext;
};

export default ({ context, createBase }: HomepageLayoutSchema) => {
    const HomepageLayoutSchema: any = flow(
        withName("HomepageLayoutSchema"),
        withFields(() => ({
            name: string(),
            data: string(),
        })),
        withHooks({
            async beforeCreate() {
                const existing = await HomepageLayoutSchema.findOne({ query: { name: this.name } });
                if (existing) {
                    throw Error(`Homepage Layout Schema with name "${this.name}" already exists.`);
                }
            },
        })
    )(createBase());

    return HomepageLayoutSchema;
}




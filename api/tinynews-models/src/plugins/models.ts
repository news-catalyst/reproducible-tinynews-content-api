// @ts-ignore
import { withStorage, withCrudLogs, withSoftDelete, withFields, pipe } from "@webiny/commodo";
import { withUser } from "@webiny/api-security";
import article from "./models/article.model";
import author from "./models/author.model";
import category from "./models/category.model";
import page from "./models/page.model";
import tag from "./models/tag.model";
import siteMetadata from "./models/siteMetadata.model";
import homepageLayoutData from "./models/homepageLayoutData.model";
import homepageLayoutSchema from "./models/homepageLayoutSchema.model";
import article2author from "./models/article2author.model";
import article2tag from "./models/article2tag.model";

/**
 * Use this "context" plugin as a way to aggregate all of service's Commodo models, and assign them
 * into the context. This way, the models become available in other parts of your code, for example,
 * when creating custom GraphQL resolvers. Note that you DON'T have to use Commodo if you don't like
 * it or it just doesn't fit your needs. Feel free to rely on a native database client or any other tool.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default () => ({
    name: "context-models",
    type: "context",
    apply(context) {
        // Let's just check if a Commodo driver is assigned to context.
        const driver = context.commodo && context.commodo.driver;
        if (!driver) {
            throw Error(
                `Commodo driver is not configured! Make sure you add a Commodo driver plugin to your service.`
            );
        }

        // A factory function that returns a base Commodo data model, upon which we create our own.
        // The base model consists of a couple of basic higher-order-functions (HOFs) that
        // provide base functionality, e.g. storing data to a database of your choice.
        // Feel free to add additional functionality if needed.
        const createBase = () => {
            return pipe(
                // Creates a simple "id" field for all of your models.
                withFields({
                    id: context.commodo.fields.id()
                }),

                // With the appropriate driver, this enables storing our models to a database.
                // @see https://github.com/webiny/commodo/tree/next/packages/fields-storage
                withStorage({ driver }),

                // Adds "createdBy", "updatedBy", and "deletedBy" fields, which are automatically populated.
                withUser(context),

                // Instead of physically deleting entries from a database, this introduces the "deleted" flag,
                // and updates it accordingly. Note that the "withSoftDelete" HOF also upgrades the base "find",
                // "findOne", "delete" and "save" operations which
                // @see https://github.com/webiny/commodo/tree/next/packages/fields-storage-soft-delete
                withSoftDelete(),

                // Adds "createdOn", "updatedOn", and "savedOn" fields, which are automatically populated.
                // @see https://github.com/doitadrian/commodo-fields-storage-crud-logs
                withCrudLogs()
            )();
        };

        context.models = {};
        context.models.Category = category({ context, createBase });
        context.models.Article = article({ context, createBase });
        context.models.Author = author({ context, createBase });
        context.models.HomepageLayoutData = homepageLayoutData({ context, createBase });
        context.models.HomepageLayoutSchema = homepageLayoutSchema({ context, createBase });
        context.models.Page = page({ context, createBase });
        context.models.SiteMetadata = siteMetadata({ context, createBase });
        context.models.Tag = tag({ context, createBase });
        context.models.Article2Author = article2author({ context, createBase });
        context.models.Article2Tag = article2tag({ context, createBase });
        context.models.createBase = createBase;

        // // Although not required, it's often convenient to have all of your models available via context.
        // context.models = {
        //     Category,
        //     Article,
        //     Author,
        //     HomepageLayoutData,
        //     HomepageLayoutSchema,
        //     Page,
        //     Tag,
        //     createBase
        // };
    }
});

/**
 * api
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface ConfigItem { 
    configType?: ConfigItem.ConfigTypeEnum;
    id?: string;
    key?: string;
    defaultValue?: string;
    value?: string;
}
export namespace ConfigItem {
    export type ConfigTypeEnum = 'None' | 'Boolean' | 'Json' | 'Image';
    export const ConfigTypeEnum = {
        None: 'None' as ConfigTypeEnum,
        Boolean: 'Boolean' as ConfigTypeEnum,
        Json: 'Json' as ConfigTypeEnum,
        Image: 'Image' as ConfigTypeEnum
    };
}

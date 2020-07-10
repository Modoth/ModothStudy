import { NodeTag } from "../../apis"
import { TagNames } from "../../domain/ITagsService"
import { ArticleContentType } from "../../plugins/IPluginInfo"

export default class IArticleViewServie {
    public getArticleType(viewer: any, baseType: string, tagsDict?: Map<string, NodeTag> | undefined, nodeTags?: Map<string, NodeTag> | undefined): ArticleContentType {
        throw new Error("Method not implemented.")
    }
}

export class ArticleViewServieSingleton implements IArticleViewServie {
    private typesCaches = new Map<string, any>()
    private getArticleTypeName(baseType: string, tagsDict?: Map<string, NodeTag>) {
        if (!tagsDict) {
            return baseType
        }
        const subType = tagsDict.get(baseType + TagNames.SubTypeSurfix)
        if (!subType) {
            return baseType
        }
        return subType.value || baseType
    }

    public getArticleType(viewer: any, baseType: string, tagsDict?: Map<string, NodeTag>, nodeTags?: Map<string, NodeTag>): ArticleContentType {
        const typeName = this.getArticleTypeName(baseType, tagsDict)
        if (this.typesCaches.has(typeName)) {
            return this.typesCaches.get(typeName)
        }
        let type: ArticleContentType = { Viewer: viewer, name: typeName, hidenSections: new Set<string>(), allSections: new Set<string>() }
        if (nodeTags) {
            let sectionsTag = nodeTags.get(typeName + TagNames.ArticleSectionSurfix) || nodeTags.get(baseType + TagNames.ArticleSectionSurfix)
            if (sectionsTag) {
                const allsections = sectionsTag.values?.split(' ').map(s => s.trim()).filter(s => s) || []
                for (let s of allsections) {
                    if (s.startsWith(TagNames.HidenSectionPrefix)) {
                        s = s.slice(TagNames.HidenSectionPrefix.length)
                        type.hidenSections.add(s)
                    }
                    type.allSections.add(s)
                }
            }
        }
        this.typesCaches.set(typeName, type)
        return type
    }
}
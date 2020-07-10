import { TagItem, TagsApi } from "../apis";
import { rewindRun } from "../common/ApiService";
import ApiConfiguration from "../common/ApiConfiguration";

export const TagNames = {
    ArticleTagsSurfix: '标签',
    TypeTag: '类型',
    SubTypeSurfix: '子类',
    ArticleSectionSurfix: '章节',
    HidenSectionPrefix: '_',
    TitleTag : '标题'
}

export default class ITagsService {

    all(): Promise<TagItem[]> {
        throw new Error("Method not implemented.")
    }

    get(name: string): Promise<TagItem | undefined> {
        throw new Error("Method not implemented.")
    }

    getValues(name: string): Promise<string[]> {
        throw new Error("Method not implemented.")
    }

    clearCache() {
        throw new Error("Method not implemented.")
    }
}

export class TagsServiceSingleton implements ITagsService {

    private tags: TagItem[] | undefined

    clearCache(): void {
        this.tags = undefined
    }
    async getValues(name: string): Promise<string[]> {
        var tag = await this.get(name)
        if (!tag || !tag.values) {
            return []
        }
        var values = tag.values!.split(' ').map(s => s.trim()).filter(s => s)
        return values;
    }
    async get(name: string): Promise<TagItem | undefined> {
        const allTags = await this.all()
        const tagsDict = new Map(allTags.map((n) => [n.name!, n]))
        return tagsDict.get(name)
    }

    async all(): Promise<TagItem[]> {
        if (!this.tags) {
            this.tags = (
                await rewindRun(() => new TagsApi(ApiConfiguration).allTags())!
            )?.data!
        }
        return this.tags
    }
}
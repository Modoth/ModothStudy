import { NodeItem, NodeTag, Configs } from '../apis';
import { ConfigsService } from '../services/configs.service';
import { Observable, forkJoin, empty } from 'rxjs';
import { map } from 'rxjs/operators';

function getConfigTags(configsService: ConfigsService) {
    return forkJoin(
        configsService.getConfig(Configs.AppConfigsEnum.DOCTYPETAG.toString()),
        configsService.getConfig(Configs.AppConfigsEnum.SOLUTIONTYPETAG.toString()),
        configsService.getConfig(Configs.AppConfigsEnum.WXSHARETAG.toString()),
        configsService.getConfig(Configs.AppConfigsEnum.AUTOPLAYTAG.toString()),
        configsService.getConfig(Configs.AppConfigsEnum.SANDBOXAPPTAG.toString())
    );
}

function updateNode(node: Node, [docTypeTag, solutionTypeTag, wechatShareTag, autoPlayTag, sandboxAppTag]
    : [string, string, string, string, string]) {
    node.tagDict = node.tags ? new Map(node.tags.map(t => [t.name, t] as any)) : new Map();
    var realTagDict = node.tagDict;
    if (node.reference) {
        realTagDict = node.reference.tags ? new Map(node.reference.tags.map(t => [t.name, t] as any)) : new Map();
        node.content = node.reference.content;
    }
    const docType = realTagDict.get(docTypeTag) || node.tagDict.get(docTypeTag);
    node.docType = docType && docType.value;
    const solutionType = realTagDict.get(solutionTypeTag) || node.tagDict.get(solutionTypeTag);
    node.solutionType = solutionType && solutionType.value;
    const wechatShare = node.tagDict.get(wechatShareTag);
    node.wxShared = !!(wechatShare && wechatShare.value);
    const autoPlay = realTagDict.get(autoPlayTag) || node.tagDict.get(autoPlayTag);
    node.autoPlay = !!autoPlay;
    const sandBoxApp = realTagDict.get(sandboxAppTag) || node.tagDict.get(sandboxAppTag);
    node.sandBox = !!sandBoxApp;
}

export function ConvertToNodeModel(nodes: NodeItem[], configsService: ConfigsService): Observable<Node[]> {
    const nodeModels = nodes as Node[];
    if (nodeModels) {
        return getConfigTags(configsService).pipe(
            map((tags) => {
                for (const node of nodeModels) {
                    updateNode(node, tags);
                }
                return nodeModels;
            })
        );
    }
    return empty()
}

export function UpdateNodeTags(node: Node, configsService: ConfigsService) {
    return getConfigTags(configsService)
        .pipe(
            map((tags) => {
                updateNode(node, tags);
                return node
            })
        );

}

export interface Node extends NodeItem {
    docType: string;
    solutionType: string;
    wxShared: boolean;
    autoPlay: boolean;
    sandBox: boolean;
    tagDict: Map<string, NodeTag>;
}

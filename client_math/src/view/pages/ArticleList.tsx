import React, { useState, useEffect } from 'react'
import './ArticleList.less'
import { useServicesLocator } from '../../app/Contexts'
import IArticleListService from '../../domain/IArticleListService'
import { Button } from 'antd';
import { CloseOutlined, PrinterOutlined, ReadOutlined, ProfileOutlined } from '@ant-design/icons'
import Article from '../../domain/Article';
import { ArticleContentType } from '../../plugins/IPluginInfo';
import classNames from 'classnames';
import IViewService from '../services/IViewService';

export default function ArticleList() {
    const locator = useServicesLocator()
    const articleListService = locator.locate(IArticleListService)
    const [items, setItems] = useState<[Article, ArticleContentType][]>([])
    const onArticleListChange = async () => {
        const all = articleListService.all()
        setItems(all)
    }
    const [columnCount, setColumnCount] = useState(2)
    articleListService.addChangeListener(onArticleListChange)
    useEffect(() => {
        return function cleanup() {
            articleListService.removeChangeListener(onArticleListChange)
        };
    });
    useEffect(() => {
        onArticleListChange()
    }, [])
    const ref = React.createRef<HTMLDivElement>()
    const close = () => {
        locator.locate(IViewService).previewArticleList(false)
    }
    return (
        <>
            <div ref={ref} className={classNames(`column-count-${columnCount}`, "article-list")}>{items.map(([article, type]) => <type.Viewer className="article" content={article.content!} files={article.files} type={type}></type.Viewer>)}
            </div>
            <div className="article-list-menus" onClick={e => e.stopPropagation()}>
                {columnCount !== 1 ? <Button type="primary" shape="circle" icon={<ProfileOutlined />} onClick={() => setColumnCount(1)} /> : null}
                {columnCount !== 2 ? <Button type="primary" shape="circle" icon={<ReadOutlined />} onClick={() => setColumnCount(2)} /> : null}
                <Button type="primary" shape="circle" icon={<PrinterOutlined />} onClick={() => window.print()} />
                <Button type="primary" danger shape="circle" icon={<CloseOutlined />} onClick={close} />
            </div>
        </>
    )
}
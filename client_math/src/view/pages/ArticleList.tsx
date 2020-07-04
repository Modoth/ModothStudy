import React, { useState, useEffect } from 'react'
import './ArticleList.less'
import { useServicesLocator } from '../../app/Contexts'
import IArticleListService from '../../domain/IArticleListService'
import { Badge, Button, Space, Divider } from 'antd';
import { ContainerOutlined, CloseOutlined, PrinterOutlined, ReadOutlined, ProfileOutlined } from '@ant-design/icons'
import Article from '../../domain/Article';
import { ArticleContentType } from '../../plugins/IPluginInfo';
import classNames from 'classnames';

export default function ArticleList() {
    const [showDetail, setShowDetail] = useState(false)
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
    const printArticles = () => {
        if (!ref.current) {
            return
        }
        const root = document.getElementById('root')
        if (!root || !root.parentNode) {
            return
        }
        const clone = document.createElement('div')
        try {
            clone.className = ref.current.className
            clone.classList.add('show-when-print')
            clone.innerHTML = ref.current.innerHTML
            root.parentNode.appendChild(clone)
            root.classList.add('hidden-when-print')
            window.print()
        }
        finally {
            root.classList.remove('hidden-when-print')
            clone.remove()
        }
    }
    if (!showDetail) {
        return items.length > 0 ? (
            <Badge count={items.length} className="article-list-summary">
                <Button onClick={() => setShowDetail(true)} type="primary" className="summary-button" size="large" shape="circle" icon={<ContainerOutlined className="head-example" />} />
            </Badge>
        ) : <></>
    }
    return <div className="article-list-popup" onClick={() => setShowDetail(false)}>
        <div className="article-list-panel" onClick={e => e.stopPropagation()} >
            <div ref={ref} className={classNames(`column-count-${columnCount}`, "article-list")}>{items.map(([article, type]) => <type.Viewer className="article" content={article.content!} files={article.files} type={type}></type.Viewer>)}
            </div>
        </div>
        <div className="menus" onClick={e => e.stopPropagation()}>
            {columnCount !== 1 ? <Button type="primary" shape="circle" icon={<ProfileOutlined />} onClick={() => setColumnCount(1)} /> : null}
            {columnCount !== 2 ? <Button type="primary" shape="circle" icon={<ReadOutlined />} onClick={() => setColumnCount(2)} /> : null}
            <Button type="primary" shape="circle" icon={<PrinterOutlined />} onClick={printArticles} />
            <Button type="primary" danger shape="circle" icon={<CloseOutlined />} onClick={() => setShowDetail(false)} />
        </div>
    </div>
}
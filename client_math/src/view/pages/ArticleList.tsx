import React, { useState, useEffect } from 'react'
import './ArticleList.less'
import { useServicesLocator } from '../../app/Contexts'
import IArticleListService from '../../domain/IArticleListService'
import { Badge, Button } from 'antd';
import { ContainerOutlined } from '@ant-design/icons'

export default function ArticleList() {
    const [showDetail, setShowDetail] = useState(false)
    const locator = useServicesLocator()
    const articleListService = locator.locate(IArticleListService)
    if (!showDetail) {
        const [count, setCount] = useState(articleListService.all().length)
        const onArticleListChange = () => {
            setCount(articleListService.all().length)
        }
        articleListService.addChangeListener(onArticleListChange)
        useEffect(() => {
            return function cleanup() {
                articleListService.removeChangeListener(onArticleListChange)
            };
        });
        return count > 0 ? (
            <Badge count={count} className="article-list">
                <Button onClick={() => setShowDetail(false)} type="primary" className="summary-button" size="large" shape="circle" icon={<ContainerOutlined className="head-example" />} />
            </Badge>
        ) : <></>
    } else {
        const items = useState() 
        const onArticleListChange = () => {
        }
        articleListService.addChangeListener(onArticleListChange)
        useEffect(() => {
            return function cleanup() {
                articleListService.removeChangeListener(onArticleListChange)
            };
        });
        return <></>
    }
}
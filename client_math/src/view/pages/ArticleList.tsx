import React, { useState } from 'react'
import './ArticleList.less'
import { useServicesLocator } from '../../app/Contexts'
import IArticleListService from '../../domain/IArticleListService'

export function ArticleList() {
    const [showDetail, setShowDetail] = useState(false)
    const locator = useServicesLocator()
    const articleListService = locator.locate(IArticleListService)
    if (!showDetail) {
        
        return <></>
    } else {
        return <></>
    }
}
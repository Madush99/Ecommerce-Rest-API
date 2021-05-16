import React from 'react'
import { Helmet } from 'react-helmet'

export const Meta = ({ title, description, keywords}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='description' content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome to Flip|BUMA',
    description: 'We sell the best products for cheap',
    keywords: 'electronics, buy electronics'
}

export default Meta
